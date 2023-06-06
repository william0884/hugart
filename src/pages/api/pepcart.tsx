import { NextApiRequest, NextApiResponse } from "next";
var MarkdownIt = require('markdown-it');
import { HfInference } from '@huggingface/inference'
import { blob } from "stream/consumers";
import fs from "fs";
import Jimp from "jimp";



const hf = new HfInference(process.env.HF_ACCESS_TOKEN)

export type Episodes = Episode[]

export interface Episode {
  name: string
  total_pages: number
  translated_languages: string[]
}

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    const pepcar = (await fetch('https://peppercarrot.com/0_sources/episodes.json'));
    const jsonData:Episodes = await pepcar.json();

    console.log(jsonData)
    const random:Episode = jsonData[Math.floor(Math.random()*jsonData.length)];

    console.log(random.name)
    const fields = random.name.split('_');
    const numb = fields[0].toUpperCase()
    const numbRemov = numb.replace('P', '')

    const ranPage = (Math.trunc(Math.random() * (random.total_pages - 1) + 1));

    const url = 'https://peppercarrot.com/0_sources/' + random.name + '/low-res/en_Pepper-and-Carrot_by-David-Revoy_' + numbRemov + 'P0' + ranPage + '.jpg'

    console.log(url)

    // const gentxt = await hf.textGeneration({
    //         model: 'gpt2',
    //         inputs: removeBool
    //     })

    // const pepsum = await hf.summarization({
    //         model: 'facebook/bart-large-cnn',
    //         inputs: gentxt['generated_text'],
    //         parameters: {
    //         max_length: 100
    //         }
    //     })
    const fimg = await fetch(url)
    const fimgb = Buffer.from(await fimg.arrayBuffer())



      const imgCaping =  await hf.imageToText({
          data: fimgb,
          model: 'nlpconnect/vit-gpt2-image-captioning'
        })
        console.log(imgCaping)
    // const imgCreate = await hf.textToImage({
    //   inputs: '80s anime ' + pepsum['summary_text'],
    //   //model: 'ogkalu/Comic-Diffusion',
    //   model: 'DucHaiten/DH_ClassicAnime'
    // })

    // console.log(gentxt)




    const helloworld  = await hf.textToSpeech({
      model: 'espnet/kan-bayashi_ljspeech_vits',
      inputs: 'Hello world!'
    })

/* 
  const arrayBuffer = await imgCreate.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
   fs.writeFileSync("test.png", buffer);

   Jimp.read(buffer)
   .then((lenna) => {
     return lenna
       .resize(256, 256) // resize
       .quality(60) // set JPEG quality
       .greyscale() // set greyscale
       .write("lena-small-bw.jpg"); // save
   })
   .catch((err) => {
     console.error(err);
   });
 */

  //  const imgclas = await hf.imageToText({
  //   data: buffer,
  //   model: 'nlpconnect/vit-gpt2-image-captioning'
  // })

  const imgCap = await hf.textToImage({
    inputs: '80s anime ' + imgCaping,
    //model: 'ogkalu/Comic-Diffusion',
    model: 'DucHaiten/DH_ClassicAnime'
  })

  const capBuffer = await imgCap.arrayBuffer();
  const uffer = Buffer.from(capBuffer);
   fs.writeFileSync("test-cap.png", uffer);

   

   const imgChange = await hf.imageToImage({
    inputs: capBuffer, 
    model: 'timbrooks/instruct-pix2pix',
    parameters: {
      prompt: 'convert to primary colors'
    }
  })

  const aBuffer = await imgChange.arrayBuffer();
  const buff = Buffer.from(aBuffer);
   fs.writeFileSync("buff.png", buff);


  

        res.status(200).json('done');

    }

