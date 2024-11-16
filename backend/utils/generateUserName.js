import User from "../models/userSchema.js";
import { randomInt } from "crypto";

export const generateUserName = async (fullName) => {
  const generateRandomNumber = () => randomInt(10, 1000);

  const nameParts = fullName.split(" ");
  const baseUsername =
    nameParts.length > 1
      ? nameParts[0].toLowerCase() + nameParts[1].toLowerCase()
      : nameParts[0].toLowerCase();

  let userName = `${baseUsername}${generateRandomNumber()}`;

  const existingUser = await User.findOne({ userName });

  if (existingUser) {
    return generateUserName(fullName);
  }

  return userName;
};
