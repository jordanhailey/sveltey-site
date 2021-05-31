import { compression, decompression, lzmajsC, lzmajsD } from "./index";

const string = "Banana", emptyString = "", number = 12, object = {"Hello":"World"};

const html =
`
<div class="test-html">
	<h1>Hello, World!</h1>
	<p>This is a test

	to see if formatting comes back through decompression...
	</p>
</div>
`;

const md = 
`
# Hello World!
	- This is a test...
		- to see if formatting comes back through decompression...
`;

describe("Compression", (compressionOp=compression) => {
	test("returns an encoded string", async () => {  
		await compressionOp(string)
			.then(output=>expect(typeof output === "string").toBe(true))
	});

	 test("buffer values are consistent", async () => {
		 let compression1 = await compressionOp(html);
		 let compression2 = await compressionOp(html);
		 let compression3 = await compressionOp(html+"\n<div></div>");
		 let allMatch = Object.entries(compression2).every(([i,v])=>{
				 let comparison = compression1[i];
				 return v === comparison;
		 });
		 let shouldntMatch = Object.entries(compression3).every(([i,v])=>{
				 let comparison = compression1[i];
				 return v === comparison;
		 });
		 expect(allMatch).toBe(true);
		 expect(shouldntMatch).toBe(false);
	 })

	test("accepts both strings and numbers as input", async () => {
		await expect(compressionOp(string)).resolves;
		await expect(compressionOp(number)).resolves;
	})

	test("rejects empty strings", async () => {  
		await expect(compressionOp(emptyString)).rejects.toThrow(/empty string/i)
	});

	test("rejects values that are not strings or numbers", async () => {  
		await expect(compressionOp(object)).rejects.toThrow(/coerced/i)
	});
});

describe("Decompression", (compressionOp=compression,decompressionOp=decompression) => {
	test("is able to decode a base64url string", () => {
		return compressionOp(string)
			.then(compressed => expect(decompressionOp(compressed)).resolves)
	});

	test("rejects a non-string input", () => {
		return decompressionOp(object)
			.then(result=>{throw new Error("result should not have been returned: " + result)})
			.catch(err=>expect(err.toString()).toMatch(/not a string/i));
	});

	test("returns a string", () => {
		return compressionOp(string)
			.then(compressed => decompressionOp(compressed))
			.then(output => expect(typeof output).toBe("string"))
	});
});

describe("Compression -> Decompression", (compressionOp=compression, decompressionOp=decompression) => {
	test("html formatting is preserved through compression", () => {
		return compressionOp(html)
			.then(compressed => decompressionOp(compressed))
			.then(decompressed => expect(decompressed).toBe(html))
	})
	test("md formatting is preserved through compression", () => {
		return compressionOp(md)
			.then(compressed => decompressionOp(compressed))
			.then(decompressed => expect(decompressed).toBe(md))
	})
})

describe("Compression operation rewrite", (compressionOp=lzmajsC) => {
	test("returns a promise (then-able)", () => {
		expect(typeof compressionOp === "function" && 
			typeof compressionOp(string).then === "function")
			.toBe(true)
	});

	test("when compressing a string, promise resolves to a string", () => {
		return compressionOp(string)
			.then(resolved=>expect(typeof resolved).toBe("string"))
			.catch(error=>expect(error).toBeFalsy())
	});
})

describe.only("Decompression operation rewrite", (compressionOp=lzmajsC, decompressionOp=lzmajsD) => {
	test("returns a promise (then-able)", () => {
		expect(typeof decompressionOp === "function" && 
			typeof decompressionOp(string).then === "function")
			.toBe(true)
	});

	test("when decompressing a string, promise resolves to a string", () => {
		return compressionOp(string)
			.then(compressed=>decompressionOp(compressed))
			.then(decompressed=>expect(typeof decompressed).toBe("string"))
			.catch(error=>expect(error).toBeFalsy())
	});

	test("string passed in to compression operation is returned, with exact formatting", () => {
		return compressionOp(longAssWriting)
			.then(compressed=>decompressionOp(compressed))
			.then(decompressed=>expect(decompressed).toBe(longAssWriting))
			.catch(error=>expect(error).toBeFalsy())
	})
})

const longAssWriting = `
The Raven
Edgar Allan Poe

Once upon a midnight dreary, while I pondered, weak and weary,
Over many a quaint and curious volume of forgotten lore—
While I nodded, nearly napping, suddenly there came a tapping,
As of some one gently rapping, rapping at my chamber door.
“’Tis some visitor,” I muttered, “tapping at my chamber door—
Only this and nothing more.”

Ah, distinctly I remember it was in the bleak December;
And each separate dying ember wrought its ghost upon the floor.
Eagerly I wished the morrow;—vainly I had sought to borrow
From my books surcease of sorrow—sorrow for the lost Lenore—
For the rare and radiant maiden whom the angels name Lenore—
Nameless here for evermore.

And the silken, sad, uncertain rustling of each purple curtain
Thrilled me—filled me with fantastic terrors never felt before;
So that now, to still the beating of my heart, I stood repeating
“’Tis some visitor entreating entrance at my chamber door—
Some late visitor entreating entrance at my chamber door;—
This it is and nothing more.”

Presently my soul grew stronger; hesitating then no longer,
“Sir,” said I, “or Madam, truly your forgiveness I implore;
But the fact is I was napping, and so gently you came rapping,
And so faintly you came tapping, tapping at my chamber door,
That I scarce was sure I heard you”—here I opened wide the door;—
Darkness there and nothing more.

Deep into that darkness peering, long I stood there wondering, fearing,
Doubting, dreaming dreams no mortal ever dared to dream before;
But the silence was unbroken, and the stillness gave no token,
And the only word there spoken was the whispered word, “Lenore?”
This I whispered, and an echo murmured back the word, “Lenore!”—
Merely this and nothing more.

Back into the chamber turning, all my soul within me burning,
Soon again I heard a tapping somewhat louder than before.
“Surely,” said I, “surely that is something at my window lattice;
Let me see, then, what thereat is, and this mystery explore—
Let my heart be still a moment and this mystery explore;—
’Tis the wind and nothing more!”

Open here I flung the shutter, when, with many a flirt and flutter,
In there stepped a stately Raven of the saintly days of yore;
Not the least obeisance made he; not a minute stopped or stayed he;
But, with mien of lord or lady, perched above my chamber door—
Perched upon a bust of Pallas just above my chamber door—
Perched, and sat, and nothing more.

Then this ebony bird beguiling my sad fancy into smiling,
By the grave and stern decorum of the countenance it wore,
“Though thy crest be shorn and shaven, thou,” I said, “art sure no craven,
Ghastly grim and ancient Raven wandering from the Nightly shore—
Tell me what thy lordly name is on the Night’s Plutonian shore!”
Quoth the Raven “Nevermore.”

Much I marvelled this ungainly fowl to hear discourse so plainly,
Though its answer little meaning—little relevancy bore;
For we cannot help agreeing that no living human being
Ever yet was blessed with seeing bird above his chamber door—
Bird or beast upon the sculptured bust above his chamber door,
With such name as “Nevermore.”

But the Raven, sitting lonely on the placid bust, spoke only
That one word, as if his soul in that one word he did outpour.
Nothing farther then he uttered—not a feather then he fluttered—
Till I scarcely more than muttered “Other friends have flown before—
On the morrow he will leave me, as my Hopes have flown before.”
Then the bird said “Nevermore.”

Startled at the stillness broken by reply so aptly spoken,
“Doubtless,” said I, “what it utters is its only stock and store
Caught from some unhappy master whom unmerciful Disaster
Followed fast and followed faster till his songs one burden bore—
Till the dirges of his Hope that melancholy burden bore
Of ‘Never—nevermore’.”

But the Raven still beguiling all my fancy into smiling,
Straight I wheeled a cushioned seat in front of bird, and bust and door;
Then, upon the velvet sinking, I betook myself to linking
Fancy unto fancy, thinking what this ominous bird of yore—
What this grim, ungainly, ghastly, gaunt, and ominous bird of yore
Meant in croaking “Nevermore.”

This I sat engaged in guessing, but no syllable expressing
To the fowl whose fiery eyes now burned into my bosom’s core;
This and more I sat divining, with my head at ease reclining
On the cushion’s velvet lining that the lamp-light gloated o’er,
But whose velvet-violet lining with the lamp-light gloating o’er,
She shall press, ah, nevermore!

Then, methought, the air grew denser, perfumed from an unseen censer
Swung by Seraphim whose foot-falls tinkled on the tufted floor.
“Wretch,” I cried, “thy God hath lent thee—by these angels he hath sent thee
Respite—respite and nepenthe from thy memories of Lenore;
Quaff, oh quaff this kind nepenthe and forget this lost Lenore!”
Quoth the Raven “Nevermore.”

“Prophet!” said I, “thing of evil!—prophet still, if bird or devil!—
Whether Tempter sent, or whether tempest tossed thee here ashore,
Desolate yet all undaunted, on this desert land enchanted—
On this home by Horror haunted—tell me truly, I implore—
Is there—is there balm in Gilead?—tell me—tell me, I implore!”
Quoth the Raven “Nevermore.”

“Prophet!” said I, “thing of evil!—prophet still, if bird or devil!
By that Heaven that bends above us—by that God we both adore—
Tell this soul with sorrow laden if, within the distant Aidenn,
It shall clasp a sainted maiden whom the angels name Lenore—
Clasp a rare and radiant maiden whom the angels name Lenore.”
Quoth the Raven “Nevermore.”

“Be that word our sign of parting, bird or fiend!” I shrieked, upstarting—
“Get thee back into the tempest and the Night’s Plutonian shore!
Leave no black plume as a token of that lie thy soul hath spoken!
Leave my loneliness unbroken!—quit the bust above my door!
Take thy beak from out my heart, and take thy form from off my door!”
Quoth the Raven “Nevermore.”

And the Raven, never flitting, still is sitting, still is sitting
On the pallid bust of Pallas just above my chamber door;
And his eyes have all the seeming of a demon’s that is dreaming,
And the lamp-light o’er him streaming throws his shadow on the floor;
And my soul from out that shadow that lies floating on the floor
Shall be lifted—nevermore!`
