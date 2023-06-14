import { NextApiRequest, NextApiResponse } from "next";
import { HfInference } from '@huggingface/inference'
const hf = new HfInference(process.env.HF_ACCESS_TOKEN)
import { getCharacter  } from 'rickmortyapi'

import { Amplify, Storage } from 'aws-amplify';
import awsconfig from '../../aws-exports';
Amplify.configure(awsconfig);

export default async function handler(req: NextApiRequest, res:NextApiResponse) {

    const output = req.body

    const randomChar = Math.random() * (826 - 1) + 1;
    //console.log(randomChar)
    const char = await getCharacter(Math.floor(randomChar))
    //console.log(rick)
    const nameSpec = await hf.fillMask({
        model: 'bert-base-uncased',
        inputs: char.data.species + ' [MASK] ' + char.data.status
      })

      
    //console.log(nameSpec.length)
    //console.log(nameSpec[Math.floor(Math.random() * (nameSpec.length - 1) + 1)])
    
    const sentence = char.data.name + ' the ' + char.data.gender + ' ' + char.data.species + ' from ' + char.data.location.name + ' is ' + char.data.status + '.'
    
    
    const fetchImg = await fetch(char.data.image)
    const arrayBuffer = await fetchImg.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imgclas = await hf.imageToText({
        data: buffer,
        model: 'nlpconnect/vit-gpt2-image-captioning'
         })
    const charExtend = await hf.textGeneration ({
        inputs: sentence + ' ' + imgclas.generated_text,
        model: 'gpt2'
    })

    const imgCap = await hf.textToImage({
        inputs: charExtend.generated_text + " " + output.input,
        //model: 'ogkalu/Comic-Diffusion',
        model: 'DucHaiten/DH_ClassicAnime'
      })

    const aBuffer = await imgCap.arrayBuffer();
    //const buff = Buffer.from(aBuffer);

    const timestamp = Number(new Date()); 
    const fileUrl = output.input + '-' + timestamp + ".png"
    
    Storage.put(fileUrl, aBuffer, {contentType: "image/png"});
    //console.log(fileUrl)

    const signedURL = await Storage.get(fileUrl);

    // const imgSpeech = await hf.imageToImage({
    //     inputs: imgCap, 
    //     model: 'timbrooks/instruct-pix2pix',
    //     parameters: {
    //       prompt: output.changes
    //     }
    //   })

    // const speechBuffer = await imgSpeech.arrayBuffer();
    //const speechBuff = Buffer.from(speechBuffer);
    // const remixTime = output.changes + '-' + timestamp + ".png"
    // Storage.put(remixTime, speechBuffer, {contentType: "image/png"});
    // console.log(remixTime)
    // const remixURL = await Storage.get(remixTime);
    //res.send(signedURL)
    res.status(200).json({'imageurl': signedURL});
}