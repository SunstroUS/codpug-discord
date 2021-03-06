import Player from "../classes/player";
import settings from "../settings.config.json";

// Import user config
const eloRange = (<any>settings).range;

function pickRandomPlayer(matchedPlayers) {
  // Get the length of the array and subtract one
  let countOfPlayersMatched = matchedPlayers.length - 1;

  // Pick a random index
  let matchedPlayerIndex =
    Math.floor(Math.random() * countOfPlayersMatched) + 1;

  // Return a matched player
  return matchedPlayers[matchedPlayerIndex];
}

/**
 *
 * @param player to find compatible match for
 * @param activePlayersInQueue to check against
 * @returns {Promise}
 */
export default function(
  player: Player,
  activePlayersInQueue: Array<Player>
): { foundMatch: boolean; matchedPlayer?: Player } {
  // Check to see if a user & enemy are compatible
  let filteredQueue = activePlayersInQueue.filter(
    activePlayer => activePlayer.id !== player.id
  );

  let matchedPlayers = filteredQueue.filter(filteredPlayer => {
    let posElo = player.elo + eloRange;
    let negElo = player.elo - eloRange;

    // Check to see if a user is within a 100 +/- enemy elo
    let eloRangeCheck =
      filteredPlayer.elo <= posElo && filteredPlayer.elo >= negElo;

    // Return that value
    return eloRangeCheck ? true : false;
  });

  if (matchedPlayers.length === 0) {
    // If there is only no matched player, return false
    return { foundMatch: false };
  } else if (matchedPlayers.length === 1) {
    // If there is only one player, than pick him
    return { foundMatch: true, matchedPlayer: matchedPlayers[0] };
  } else {
    // If there is more than 1 player, pick random player
    return {
      foundMatch: true,
      matchedPlayer: pickRandomPlayer(matchedPlayers)
    };
  }
}
