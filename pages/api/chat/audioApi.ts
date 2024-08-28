import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { format } from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text } = req.body;

    const requestData = {
      text: text,
      id: 0,
      preset: 'default',
    };
    console.log('requestData:', requestData);
    try {
      // 使用 fetch 发送 POST 请求到本地服务器
      const response = await fetch('http://192.168.1.160:23456/voice/gpt-sovits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      // 确保响应成功
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText}`);
      }

      // 读取响应中的二进制数据 (arrayBuffer)
      const audioData = await response.arrayBuffer();

      // 将音频数据返回给前端
      res.status(200).send(Buffer.from(audioData));
    } catch (error) {
      console.error('Error fetching audio from local server:', error);
      res.status(500).json({ error: 'Failed to fetch audio' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}