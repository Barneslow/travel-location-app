import axios from "axios";

require("dotenv").config();

export function getMapPreview(lat, lng) {
  const imageURL = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${process.env.GOOGLE_API_KEY}`;

  // const imageURL = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=13&size=400x200&maptype=roadmap
  //   &markers=color:red%7Clabel:S%7C${lat},${lng}
  //   &key=${GOOGLE_API_KEY}&signature=YOUR_SIGNATURE`;

  return imageURL;
}

export async function getAddress(lat, lng) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_API_KEY}`
    );

    const address = response.data.results[0].formatted_address;

    return address;
  } catch (error) {
    throw new Error("Failed to fetch address!");
  }
}
