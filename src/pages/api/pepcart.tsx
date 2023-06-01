import { NextApiRequest, NextApiResponse } from "next";
var MarkdownIt = require('markdown-it');
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HF_ACCESS_TOKEN)

export type Episodes = Episode[]

export interface Episode {
  name: string
  total_pages: number
  translated_languages: string[]
}

export type Texts = Text[]

export interface Text {
  type: string
  tag: string
  attrs: any
  map?: number[]
  nesting: number
  level: number
  children?: Children[]
  content: string
  markup: string
  info: string
  meta: any
  block: boolean
  hidden: boolean
}

export interface Children {
  type: string
  tag: string
  attrs: any
  map: any
  nesting: number
  level: number
  children: any
  content: string
  markup: string
  info: string
  meta: any
  block: boolean
  hidden: boolean
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

    const pcmd = 'https://peppercarrot.com/0_sources/' + random.name + '/lang/en/' + fields[0] + '_en_transcript.md'

    console.log(pcmd)
    const fetmd = await fetch(pcmd);
    const femd = await fetmd.text()

    var md = new MarkdownIt()
    var mdparse:Texts = md.parse(femd, {})
    const comicText: string[] = [];

    for (var prop in mdparse) {
    if (mdparse[prop]['type'] == 'inline') {
        comicText.push(mdparse[prop]['content'])
    }
    }

    const comicSlice = comicText.slice(25, -55)
    const sliceJoin = comicSlice.join(' ')
    const removeBool = sliceJoin.replaceAll("False", "").replaceAll("Whitespace (Optional)", "").replaceAll("True", "").replaceAll(/[0-9]/g, '').replaceAll('Concatenate', '').replaceAll('Position', '')
    const gentxt = await hf.textGeneration({
            model: 'gpt2',
            inputs: removeBool
        })

    const pepsum = await hf.summarization({
            model: 'facebook/bart-large-cnn',
            inputs: gentxt['generated_text'],
            parameters: {
            max_length: 100
            }
        })

    console.log(gentxt)

        res.status(200).json(pepsum);

    }

