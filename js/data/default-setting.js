import StorageSetting from "../storage/storage-setting.js";

const gameWeight = StorageSetting.get('game/weight');
const langWeight = StorageSetting.get('lang/weight');
const tagsWeight = StorageSetting.get('tags/weight');
const wordWeight = StorageSetting.get('word/weight');

if(langWeight.size === 0)
	langWeight.set('pt', 50);

if(gameWeight.size === 0){
	gameWeight.set('Astroneer', 100);
	gameWeight.set('Backpack Battles', 40);
	gameWeight.set('Balatro', 40);
	gameWeight.set('Banished', 30);
	gameWeight.set('Bioweaver', 30);
	gameWeight.set('Castle Craft', 60);
	gameWeight.set('Darkest Dungeon', 5);
	gameWeight.set('Deep Rock Galactic', 70);
	gameWeight.set('Dicey Dungeons', 30);
	gameWeight.set('Empyrion: Galactic Survival', 100);
	gameWeight.set('Enshrouded', 70);
	gameWeight.set('Gartic', 40);
	gameWeight.set('Gear Blocks', 80);
	gameWeight.set('Hand of Fate 2', 10);
	gameWeight.set('Hell Clock', 90);
	gameWeight.set('HoloCure: Save the Fans!', 20);
	gameWeight.set('Inscryption', 30);
	gameWeight.set('Magicka 2', 50);
	gameWeight.set('Magicka', 50);
	gameWeight.set('Magicmaker', 10);
	gameWeight.set('Magicraft', 40);
	gameWeight.set('Main Assembly', 100);
	gameWeight.set('Nimbatus: Drone Creator', 50);
	gameWeight.set('Nimbatus: The Space Drone Constructor', 50);
	gameWeight.set('Portal 2', 30);
	gameWeight.set('Raft', 90);
	gameWeight.set('Reassembly', 10);
	gameWeight.set('Robocraft 2', 10);
	gameWeight.set('Robocraft', 10);
	gameWeight.set('Scrap Mechanic', 100);
	gameWeight.set('Screw Drivers', 100);
	gameWeight.set('Slay the Spire', 15);
	gameWeight.set('Splendor', 40);
	gameWeight.set('StarCraft II', 30);
	gameWeight.set('Stoneshard', 10);
	gameWeight.set('The Elder Scrolls V: Skyrim - Special Edition', 30);
	gameWeight.set('Trailmakers', 100);
	gameWeight.set('Valheim', 70);
	gameWeight.set('Vampire Survivors', 10);
	gameWeight.set('Worms: Ultimate Mayhem', 10);
	gameWeight.set('XCOM 2', 10);
}


tagsWeight.set('iniciante', 100);
tagsWeight.set('beginner', 100);
tagsWeight.set('newbie', 100);
tagsWeight.set('noob', 100);
tagsWeight.set('brasil', 70);
tagsWeight.set('aprendendo', 100);
tagsWeight.set('primeiravez', 100);
tagsWeight.set('primeiravezjogando', 100);
tagsWeight.set('steam', 60);
tagsWeight.set('discord', 60);

tagsWeight.set('portugal', 10);
tagsWeight.set('valorant', 1);
tagsWeight.set('xbox', 1);
tagsWeight.set('ps2', 1);
tagsWeight.set('ps5', 1);
tagsWeight.set('fortinite', 1);
tagsWeight.set('dota2', 1);

wordWeight.set('!sr\\b', 100);
wordWeight.set('!steam\\b', 100);
wordWeight.set('!discord\\b', 100);

wordWeight.set('\\brerun\\b', 1);

