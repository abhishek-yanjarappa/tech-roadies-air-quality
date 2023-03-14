import { isLatLonValid } from "@roadies/utils/isStateValid";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  data?: any;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const lat = req.query?.["lat"] as string;
  const lon = req?.query?.["lon"] as string;
  if (!isLatLonValid(lat, lon)) {
    return res.status(401).json({ message: "Invalid inputs" });
  }

  const options = {
    method: "GET",
    url: "https://air-quality.p.rapidapi.com/current/airquality",
    params: { lon: lon, lat: lat },
    headers: {
      "X-RapidAPI-Key": process.env?.["API_KEY"],
      "X-RapidAPI-Host": "air-quality.p.rapidapi.com",
    },
  };

  const data = (await axios.request(options)).data;

  res.status(200).json({ data });
}
