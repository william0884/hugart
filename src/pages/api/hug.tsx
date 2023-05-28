import { NextApiRequest, NextApiResponse } from "next";
import { HfInference } from '@huggingface/inference'

const hf = new HfInference()

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    const output = req.body
    const hugfill = await hf.fillMask({
        model: 'bert-base-uncased',
        inputs: output.input
      })
      console.log(hugfill)
      res.status(200).json({hugfill});
    }