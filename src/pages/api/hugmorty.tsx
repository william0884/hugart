import { NextApiRequest, NextApiResponse } from "next";
import { HfInference } from '@huggingface/inference'
const hf = new HfInference(process.env.HF_ACCESS_TOKEN)
import { getCharacter  } from 'rickmortyapi'
import fs from "fs";

async function extendAgain(sentence:string){
    const charExtend = await hf.textGeneration ({
        inputs: sentence,
        model: 'gpt2'
    })
    return charExtend

}

export default async function handler(req: NextApiRequest, res:NextApiResponse) {

    const output = req.body

    const randomChar = Math.random() * (826 - 1) + 1;
    console.log(randomChar)
    const char = await getCharacter(Math.floor(randomChar))
    //console.log(rick)
    const nameSpec = await hf.fillMask({
        model: 'bert-base-uncased',
        inputs: char.data.species + ' [MASK] ' + char.data.status
      })

      
    console.log(nameSpec.length)
    console.log(nameSpec[Math.floor(Math.random() * (nameSpec.length - 1) + 1)])
    
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
      const buff = Buffer.from(aBuffer);
      fs.writeFileSync("buffing.png", buff);

      const imgSpeech = await hf.imageToImage({
        inputs: imgCap, 
        model: 'timbrooks/instruct-pix2pix',
        parameters: {
          prompt: output.changes
        }
      })

      const speechBuffer = await imgSpeech.arrayBuffer();
      const speechBuff = Buffer.from(speechBuffer);
      fs.writeFileSync("speech.png", speechBuff);



    console.log(sentence)
    console.log(charExtend.generated_text)


    console.log(imgclas)
    res.status(200).json(charExtend.generated_text);
}