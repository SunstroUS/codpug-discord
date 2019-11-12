import { Message } from "discord.js";
import db from "./firebase";
import Player from "../classes/player";

let playersCollection = db.collection("players");

let checkDbForPlayer = async userId => {
  try {
    let player = await playersCollection.doc(userId).get();

    let playerExists = (await player.exists) ? true : false;

    return playerExists;
  } catch (error) {
    console.log("Problem checking player");
  }
};

/**
 *
 * @param msg Incoming Message object from discord
 * @returns Player
 */
export default async function(msg: Message) {
  // Destructure msg object
  let { username, id } = msg.author;

  // Check to see if player already exists
  let playerAlreadyExists = await checkDbForPlayer(id);

  // If player does exist, then return the player data
  if (playerAlreadyExists) {
    console.log("Player does exist");
    let player = await playersCollection.doc(id).get();
    return await player.data();
  } else {
    console.log("Player does not exist");
    let newUser = {
      username,
      id,
      elo: 50,
      inQueue: false
    };

    // Add new user to database
    await playersCollection.doc(id).set(newUser);

    return newUser;
  }
}