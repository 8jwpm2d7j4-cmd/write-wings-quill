DO $$
DECLARE
  v_uid uuid;
  v_mid uuid;
  v_title text;
  v_genre text;
  v_synopsis text;
  v_n_chapters int;
  v_n_likes int;
  v_liker uuid;
BEGIN
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Vera Park', bio='Writing slow novels in Tbilisi. Tea, lighthouses, long walks. [seed]', genres=ARRAY['Sci-Fi']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'An Inventory of Hotel of Tides', 'An astronaut, grounded by an injury, ghostwrites memoirs for the dying — until one of them starts writing back.', 'YA', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'Before the trial, before the trial of the trial, there was the long hot week when Vera stopped sleeping.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

He counted his footsteps along the corridor, an old habit from a school he''d been told never to mention.', 0, 204, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

Snow began to fall, very slow at first, as if the sky were trying not to wake anyone.

In the morning, the boat was gone, and so was the sound of the bell.', 1, 197, false, NULL);
  UPDATE public.manuscripts SET word_count = 401 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Rohan Tanaka', bio='I write about quiet women doing loud things. Mumbai, occasionally. [seed]', genres=ARRAY['Memoir']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Quiet Cartographer of Garden', 'Three generations of women, one stubborn orchard, and the year the apples refused to ripen.', 'Literary', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The map was older than the country it described. Rohan traced the rivers with a fingernail and felt them move.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

Outside, the rain came in sheets so thick the streetlamps looked like drowned suns.', 0, 203, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.

The river took what it had been promised, and gave back something neither of them had asked for.', 1, 195, false, NULL);
  UPDATE public.manuscripts SET word_count = 398 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Ines Reyes', bio='Writing slow novels in Brooklyn. Tea, lighthouses, long walks. [seed]', genres=ARRAY['Sci-Fi']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Year of Almanac of Hotel', 'A grieving cartographer returns to her childhood island and discovers the maps are wrong on purpose.', 'Mystery', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'There is a particular kind of silence that follows a confession. Ines learned it that summer, in a kitchen that smelled of bergamot.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

She had loved him the way one loves a country one has had to leave — gratefully, uneasily, with a small and permanent ache.', 0, 215, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

She turned the page of the journal and the handwriting changed mid-sentence — as if the writer had been replaced.', 1, 228, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

Outside, the rain came in sheets so thick the streetlamps looked like drowned suns.

The lighthouse blinked once. Then twice. Then steady, the way it always had.', 2, 186, false, NULL);
  UPDATE public.manuscripts SET word_count = 629 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Marisol Hjelm', bio='Writing slow novels in Mumbai. Tea, lighthouses, long walks. [seed]', genres=ARRAY['YA']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Hours', 'A romance, slow as snowmelt, between a pastry chef and the journalist sent to expose her father.', 'Historical', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'There is a particular kind of silence that follows a confession. Marisol learned it that summer, in a kitchen that smelled of bergamot.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.', 0, 204, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

The phone rang once and stopped. They both pretended not to hear it.', 1, 207, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

She turned the page of the journal and the handwriting changed mid-sentence — as if the writer had been replaced.

And so the orchard kept its quiet promise, the way orchards do.', 2, 193, false, NULL);
  UPDATE public.manuscripts SET word_count = 604 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Sven Chen', bio='Literary fiction from the kitchen table. Seville. [seed]', genres=ARRAY['Fantasy','Thriller']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The House of Cartographer', 'A literary thriller set during a long heatwave, in a town where everyone is keeping the same secret a little differently.', 'Historical', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The day Sven disappeared, the sky turned the color of old brass. Nobody in the village said a word.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

He counted his footsteps along the corridor, an old habit from a school he''d been told never to mention.', 0, 205, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.', 1, 214, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

Snow began to fall, very slow at first, as if the sky were trying not to wake anyone.

In the morning, the boat was gone, and so was the sound of the bell.', 2, 194, false, NULL);
  UPDATE public.manuscripts SET word_count = 613 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Nora Hayes', bio='Trying to write the book my fifteen-year-old self needed. Tbilisi. [seed]', genres=ARRAY['Sci-Fi']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Year of Hotel of Nightingale', 'On the night of a small-town auction, an heirloom locket changes hands four times — and so does a secret.', 'Mystery', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'If there had been a god in that town, Nora thought, he had retired and moved south.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.', 0, 199, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.', 1, 223, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.', 2, 217, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Karelia Station', 'There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

She had loved him the way one loves a country one has had to leave — gratefully, uneasily, with a small and permanent ache.

And so the orchard kept its quiet promise, the way orchards do.', 3, 199, false, NULL);
  UPDATE public.manuscripts SET word_count = 838 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Cora Khoury', bio='I write about quiet women doing loud things. Brooklyn, occasionally. [seed]', genres=ARRAY['Romance','Mystery']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Long Telegraph', 'A romance, slow as snowmelt, between a pastry chef and the journalist sent to expose her father.', 'Horror', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'Cora never trusted the train. It always pulled into Karelia station two minutes late and left thirty seconds early — as if begging to lose someone.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He counted his footsteps along the corridor, an old habit from a school he''d been told never to mention.', 0, 203, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.', 1, 230, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

The phone rang once and stopped. They both pretended not to hear it.', 2, 216, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Karelia Station', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

Snow began to fall, very slow at first, as if the sky were trying not to wake anyone.

In the morning, the boat was gone, and so was the sound of the bell.', 3, 188, false, NULL);
  UPDATE public.manuscripts SET word_count = 837 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Bea Hjelm', bio='Romance, mostly. Mysteries, sometimes. Always cats. Reykjavík. [seed]', genres=ARRAY['Horror','YA','Romance']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Long Northern Sky', 'A retired translator falls in love with a letter he can''t deliver and the woman who wrote it.', 'Fantasy', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'Bea never trusted the train. It always pulled into Karelia station two minutes late and left thirty seconds early — as if begging to lose someone.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

Every map of the island lied about something. The honest ones lied about the same thing.', 0, 204, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.

The river took what it had been promised, and gave back something neither of them had asked for.', 1, 191, false, NULL);
  UPDATE public.manuscripts SET word_count = 395 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Niko Romero', bio='Short stories, long winters. Helsinki. [seed]', genres=ARRAY['Memoir','Mystery','Sci-Fi']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'After the Auction', 'Three generations of women, one stubborn orchard, and the year the apples refused to ripen.', 'Memoir', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'On the morning of the auction, Niko discovered the locket was still warm.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The phone rang once and stopped. They both pretended not to hear it.', 0, 183, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.', 1, 221, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

She turned the page of the journal and the handwriting changed mid-sentence — as if the writer had been replaced.', 2, 219, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Karelia Station', 'He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The phone rang once and stopped. They both pretended not to hear it.

There would be other towns, other trains, other versions of the story. This one, at least, was hers.', 3, 191, false, NULL);
  UPDATE public.manuscripts SET word_count = 814 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Ash Ash', bio='Writing slow novels in Mexico City. Tea, lighthouses, long walks. [seed]', genres=ARRAY['Romance','Sci-Fi']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Long Burning of Hotel', 'Three generations of women, one stubborn orchard, and the year the apples refused to ripen.', 'Historical', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The map was older than the country it described. Ash traced the rivers with a fingernail and felt them move.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

She had loved him the way one loves a country one has had to leave — gratefully, uneasily, with a small and permanent ache.', 0, 208, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.

The river took what it had been promised, and gave back something neither of them had asked for.', 1, 196, false, NULL);
  UPDATE public.manuscripts SET word_count = 404 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Felix Greer', bio='Romance, mostly. Mysteries, sometimes. Always cats. Naples. [seed]', genres=ARRAY['Mystery','Thriller','Memoir']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'A Map of Hotel', 'On the night of a small-town auction, an heirloom locket changes hands four times — and so does a secret.', 'Horror', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The map was older than the country it described. Felix traced the rivers with a fingernail and felt them move.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.', 0, 198, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

She had loved him the way one loves a country one has had to leave — gratefully, uneasily, with a small and permanent ache.', 1, 221, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.

The lighthouse blinked once. Then twice. Then steady, the way it always had.', 2, 196, false, NULL);
  UPDATE public.manuscripts SET word_count = 615 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Bea Lévy', bio='Romance, mostly. Mysteries, sometimes. Always cats. Brooklyn. [seed]', genres=ARRAY['Thriller','YA','Sci-Fi']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Small Inheritance of Lilacs', 'A romance, slow as snowmelt, between a pastry chef and the journalist sent to expose her father.', 'Mystery', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The map was older than the country it described. Bea traced the rivers with a fingernail and felt them move.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

Every map of the island lied about something. The honest ones lied about the same thing.', 0, 199, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

She had loved him the way one loves a country one has had to leave — gratefully, uneasily, with a small and permanent ache.', 1, 232, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

Snow began to fall, very slow at first, as if the sky were trying not to wake anyone.', 2, 224, true, 99);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Karelia Station', 'There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.

She left the locket on the table and walked into the rest of her life.', 3, 190, true, 299);
  UPDATE public.manuscripts SET word_count = 845 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Jules Solberg', bio='Chapter by chapter. Coffee strong. Tbilisi-based. [seed]', genres=ARRAY['YA','Sci-Fi','Mystery']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'A Map of Wintering', 'A retired translator falls in love with a letter he can''t deliver and the woman who wrote it.', 'Literary', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The lighthouse hadn''t blinked in three nights. Jules stood on the cliff and watched the dark water as if waiting for it to answer back.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

The phone rang once and stopped. They both pretended not to hear it.', 0, 203, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.

Years later, when anyone asked, she would say only: ''It was a good summer. The best one. We meant it.''', 1, 200, false, NULL);
  UPDATE public.manuscripts SET word_count = 403 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Ruben Whittaker', bio='Writing slow novels in Mexico City. Tea, lighthouses, long walks. [seed]', genres=ARRAY['Mystery']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The House of Wintering', 'An astronaut, grounded by an injury, ghostwrites memoirs for the dying — until one of them starts writing back.', 'Fantasy', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The map was older than the country it described. Ruben traced the rivers with a fingernail and felt them move.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.', 0, 204, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.', 1, 210, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

Every map of the island lied about something. The honest ones lied about the same thing.

And so the orchard kept its quiet promise, the way orchards do.', 2, 187, false, NULL);
  UPDATE public.manuscripts SET word_count = 601 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Talia Galland', bio='I write about quiet women doing loud things. Cape Town, occasionally. [seed]', genres=ARRAY['Mystery','Sci-Fi','Horror']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Year of Hotel', 'Three generations of women, one stubborn orchard, and the year the apples refused to ripen.', 'Historical', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'Talia never trusted the train. It always pulled into Karelia station two minutes late and left thirty seconds early — as if begging to lose someone.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.', 0, 200, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

She turned the page of the journal and the handwriting changed mid-sentence — as if the writer had been replaced.', 1, 225, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.

She left the locket on the table and walked into the rest of her life.', 2, 190, false, NULL);
  UPDATE public.manuscripts SET word_count = 615 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Talia Aoki', bio='Literary fiction from the kitchen table. Marseille. [seed]', genres=ARRAY['Thriller','Sci-Fi']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Before Cartographer', 'A literary thriller set during a long heatwave, in a town where everyone is keeping the same secret a little differently.', 'Sci-Fi', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The map was older than the country it described. Talia traced the rivers with a fingernail and felt them move.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.', 0, 195, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.

In the morning, the boat was gone, and so was the sound of the bell.', 1, 198, false, NULL);
  UPDATE public.manuscripts SET word_count = 393 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Idris Esposito', bio='Short stories, long winters. Tbilisi. [seed]', genres=ARRAY['Memoir','Historical','YA']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Long Confession', 'An astronaut, grounded by an injury, ghostwrites memoirs for the dying — until one of them starts writing back.', 'Mystery', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The first rule of the orchard was simple: don''t eat anything that knows your name. Idris broke it on a Tuesday.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.', 0, 196, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

The phone rang once and stopped. They both pretended not to hear it.', 1, 222, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.', 2, 216, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Karelia Station', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

The phone rang once and stopped. They both pretended not to hear it.

And so the orchard kept its quiet promise, the way orchards do.', 3, 195, true, 99);
  UPDATE public.manuscripts SET word_count = 829 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Aris Chen', bio='Author of two books and many drafts. Currently lost in Tallinn. [seed]', genres=ARRAY['Romance','Fantasy']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Last Lighthouse', 'A retired translator falls in love with a letter he can''t deliver and the woman who wrote it.', 'Literary', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The first rule of the orchard was simple: don''t eat anything that knows your name. Aris broke it on a Tuesday.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

She had loved him the way one loves a country one has had to leave — gratefully, uneasily, with a small and permanent ache.', 0, 208, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.

She left the locket on the table and walked into the rest of her life.', 1, 190, false, NULL);
  UPDATE public.manuscripts SET word_count = 398 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Nia Ito', bio='Author of two books and many drafts. Currently lost in Porto. [seed]', genres=ARRAY['Romance','Historical','YA']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'An Inventory of Northern Sky of Wintering', 'Two estranged sisters reopen their grandmother''s bookshop and the rooms begin to remember things they don''t.', 'Historical', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The letter said: ''Come home. Bring nothing.'' That was enough — Nia bought a one-way ticket the same hour.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

Snow began to fall, very slow at first, as if the sky were trying not to wake anyone.', 0, 202, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.', 1, 226, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.', 2, 217, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Karelia Station', 'The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

He counted his footsteps along the corridor, an old habit from a school he''d been told never to mention.

In the morning, the boat was gone, and so was the sound of the bell.', 3, 203, false, NULL);
  UPDATE public.manuscripts SET word_count = 848 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Nadia Solberg', bio='Short stories, long winters. Tbilisi. [seed]', genres=ARRAY['Fantasy','Romance','Literary']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Notes on Hours of Hotel', 'Two estranged sisters reopen their grandmother''s bookshop and the rooms begin to remember things they don''t.', 'Thriller', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'On the morning of the auction, Nadia discovered the locket was still warm.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

The phone rang once and stopped. They both pretended not to hear it.', 0, 190, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

The phone rang once and stopped. They both pretended not to hear it.

And so the orchard kept its quiet promise, the way orchards do.', 1, 189, false, NULL);
  UPDATE public.manuscripts SET word_count = 379 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Ruben Aoki', bio='Trying to write the book my fifteen-year-old self needed. Edinburgh. [seed]', genres=ARRAY['Historical','Thriller']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The House of Borrowed Light', 'On the night of a small-town auction, an heirloom locket changes hands four times — and so does a secret.', 'Historical', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'Ruben never trusted the train. It always pulled into Karelia station two minutes late and left thirty seconds early — as if begging to lose someone.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

She had loved him the way one loves a country one has had to leave — gratefully, uneasily, with a small and permanent ache.', 0, 217, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

He counted his footsteps along the corridor, an old habit from a school he''d been told never to mention.

He laughed, finally, and the laughter sounded like a window opening.', 1, 194, false, NULL);
  UPDATE public.manuscripts SET word_count = 411 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Cleo Vance', bio='Romance, mostly. Mysteries, sometimes. Always cats. Tallinn. [seed]', genres=ARRAY['YA']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'A Map of Tides', 'After the lighthouse goes dark, a marine biologist begins receiving messages in her field notes that aren''t hers.', 'YA', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The day Cleo disappeared, the sky turned the color of old brass. Nobody in the village said a word.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

She turned the page of the journal and the handwriting changed mid-sentence — as if the writer had been replaced.', 0, 204, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

Snow began to fall, very slow at first, as if the sky were trying not to wake anyone.', 1, 221, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

Outside, the rain came in sheets so thick the streetlamps looked like drowned suns.', 2, 220, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Karelia Station', 'There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.

He laughed, finally, and the laughter sounded like a window opening.', 3, 190, false, NULL);
  UPDATE public.manuscripts SET word_count = 835 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Felix Drummond', bio='Romance, mostly. Mysteries, sometimes. Always cats. Tallinn. [seed]', genres=ARRAY['Sci-Fi','Thriller','Mystery']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Bright Visitors', 'A romance, slow as snowmelt, between a pastry chef and the journalist sent to expose her father.', 'Romance', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The map was older than the country it described. Felix traced the rivers with a fingernail and felt them move.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

Every map of the island lied about something. The honest ones lied about the same thing.', 0, 194, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

She turned the page of the journal and the handwriting changed mid-sentence — as if the writer had been replaced.', 1, 218, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

Every map of the island lied about something. The honest ones lied about the same thing.

He laughed, finally, and the laughter sounded like a window opening.', 2, 191, false, NULL);
  UPDATE public.manuscripts SET word_count = 603 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Cora Kim', bio='Short stories, long winters. Tallinn. [seed]', genres=ARRAY['Memoir']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Notes on Garden', 'Three generations of women, one stubborn orchard, and the year the apples refused to ripen.', 'Horror', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'Before the trial, before the trial of the trial, there was the long hot week when Cora stopped sleeping.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.', 0, 199, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

Outside, the rain came in sheets so thick the streetlamps looked like drowned suns.

And so the orchard kept its quiet promise, the way orchards do.', 1, 191, false, NULL);
  UPDATE public.manuscripts SET word_count = 390 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Dario Yoo', bio='Writing slow novels in Edinburgh. Tea, lighthouses, long walks. [seed]', genres=ARRAY['Literary','Sci-Fi']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'After the Lighthouse', 'Two estranged sisters reopen their grandmother''s bookshop and the rooms begin to remember things they don''t.', 'Sci-Fi', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The day Dario disappeared, the sky turned the color of old brass. Nobody in the village said a word.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.', 0, 199, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.

The river took what it had been promised, and gave back something neither of them had asked for.', 1, 190, false, NULL);
  UPDATE public.manuscripts SET word_count = 389 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Iris Petrov', bio='Reader first, writer second. Posting from Brooklyn. [seed]', genres=ARRAY['Horror']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Before Garden of Almanac', 'Two estranged sisters reopen their grandmother''s bookshop and the rooms begin to remember things they don''t.', 'Literary', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The first rule of the orchard was simple: don''t eat anything that knows your name. Iris broke it on a Tuesday.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.', 0, 210, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.', 1, 214, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The phone rang once and stopped. They both pretended not to hear it.', 2, 212, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Karelia Station', 'They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.

She closed the door and listened to the latch settle, and for the first time in years she felt at home in her own breathing.', 3, 205, false, NULL);
  UPDATE public.manuscripts SET word_count = 841 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Theo Mercer', bio='Short stories, long winters. Marseille. [seed]', genres=ARRAY['Horror']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Bright Saltwater', 'A retired translator falls in love with a letter he can''t deliver and the woman who wrote it.', 'Horror', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The first rule of the orchard was simple: don''t eat anything that knows your name. Theo broke it on a Tuesday.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.', 0, 196, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

Outside, the rain came in sheets so thick the streetlamps looked like drowned suns.

There would be other towns, other trains, other versions of the story. This one, at least, was hers.', 1, 194, false, NULL);
  UPDATE public.manuscripts SET word_count = 390 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Joon Kim', bio='Romance, mostly. Mysteries, sometimes. Always cats. Tallinn. [seed]', genres=ARRAY['Historical','Sci-Fi','YA']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'An Inventory of Borrowed Light', 'Two estranged sisters reopen their grandmother''s bookshop and the rooms begin to remember things they don''t.', 'Horror', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The letter said: ''Come home. Bring nothing.'' That was enough — Joon bought a one-way ticket the same hour.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

Every map of the island lied about something. The honest ones lied about the same thing.', 0, 194, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

She had loved him the way one loves a country one has had to leave — gratefully, uneasily, with a small and permanent ache.', 1, 223, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.

In the morning, the boat was gone, and so was the sound of the bell.', 2, 195, false, NULL);
  UPDATE public.manuscripts SET word_count = 612 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Ash Wells', bio='Chapter by chapter. Coffee strong. Dublin-based. [seed]', genres=ARRAY['YA','Horror']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Long Wintering', 'Two estranged sisters reopen their grandmother''s bookshop and the rooms begin to remember things they don''t.', 'Horror', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The lighthouse hadn''t blinked in three nights. Ash stood on the cliff and watched the dark water as if waiting for it to answer back.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

She turned the page of the journal and the handwriting changed mid-sentence — as if the writer had been replaced.', 0, 210, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.', 1, 220, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

He counted his footsteps along the corridor, an old habit from a school he''d been told never to mention.

Years later, when anyone asked, she would say only: ''It was a good summer. The best one. We meant it.''', 2, 199, false, NULL);
  UPDATE public.manuscripts SET word_count = 629 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Nia Petrov', bio='Stories about home and the people we leave behind. Brooklyn. [seed]', genres=ARRAY['Fantasy','YA']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Year of Telegraph of Almanac', 'On the night of a small-town auction, an heirloom locket changes hands four times — and so does a secret.', 'Horror', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'Before the trial, before the trial of the trial, there was the long hot week when Nia stopped sleeping.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

Every map of the island lied about something. The honest ones lied about the same thing.', 0, 200, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.', 1, 217, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.

In the morning, the boat was gone, and so was the sound of the bell.', 2, 193, false, NULL);
  UPDATE public.manuscripts SET word_count = 610 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Mira Faraj', bio='Stories about home and the people we leave behind. Lisbon. [seed]', genres=ARRAY['Fantasy']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Long Telegraph of Visitors', 'An astronaut, grounded by an injury, ghostwrites memoirs for the dying — until one of them starts writing back.', 'Literary', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The map was older than the country it described. Mira traced the rivers with a fingernail and felt them move.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.', 0, 206, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The phone rang once and stopped. They both pretended not to hear it.', 1, 212, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He counted his footsteps along the corridor, an old habit from a school he''d been told never to mention.

She closed the door and listened to the latch settle, and for the first time in years she felt at home in her own breathing.', 2, 207, false, NULL);
  UPDATE public.manuscripts SET word_count = 625 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Mira Ash', bio='Writing slow novels in Buenos Aires. Tea, lighthouses, long walks. [seed]', genres=ARRAY['YA']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Bright Orchard', 'A retired translator falls in love with a letter he can''t deliver and the woman who wrote it.', 'Romance', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The map was older than the country it described. Mira traced the rivers with a fingernail and felt them move.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

Every map of the island lied about something. The honest ones lied about the same thing.', 0, 194, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.', 1, 224, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

He counted his footsteps along the corridor, an old habit from a school he''d been told never to mention.

He laughed, finally, and the laughter sounded like a window opening.', 2, 189, false, NULL);
  UPDATE public.manuscripts SET word_count = 607 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Kenji Galland', bio='Literary fiction from the kitchen table. Cape Town. [seed]', genres=ARRAY['Thriller','Horror','Sci-Fi']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Letters from Confession', 'A teenage hacker uncovers a quiet conspiracy in her city''s transit system — and the man she''s been told to call uncle.', 'YA', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The map was older than the country it described. Kenji traced the rivers with a fingernail and felt them move.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

She turned the page of the journal and the handwriting changed mid-sentence — as if the writer had been replaced.', 0, 207, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The phone rang once and stopped. They both pretended not to hear it.', 1, 217, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The phone rang once and stopped. They both pretended not to hear it.

He never wrote to her again. But every spring, on the day they had met, the lilacs bloomed too early — and he noticed.', 2, 202, false, NULL);
  UPDATE public.manuscripts SET word_count = 626 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Holden Adler', bio='Stories about home and the people we leave behind. Edinburgh. [seed]', genres=ARRAY['Historical']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Bright Tides', 'Two estranged sisters reopen their grandmother''s bookshop and the rooms begin to remember things they don''t.', 'Thriller', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'Before the trial, before the trial of the trial, there was the long hot week when Holden stopped sleeping.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

Every map of the island lied about something. The honest ones lied about the same thing.', 0, 192, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

Every map of the island lied about something. The honest ones lied about the same thing.

There would be other towns, other trains, other versions of the story. This one, at least, was hers.', 1, 188, false, NULL);
  UPDATE public.manuscripts SET word_count = 380 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Bea Hayes', bio='Chapter by chapter. Coffee strong. Naples-based. [seed]', genres=ARRAY['Fantasy','Romance','Memoir']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Before Almanac', 'Two estranged sisters reopen their grandmother''s bookshop and the rooms begin to remember things they don''t.', 'Horror', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The lighthouse hadn''t blinked in three nights. Bea stood on the cliff and watched the dark water as if waiting for it to answer back.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

The phone rang once and stopped. They both pretended not to hear it.', 0, 197, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

She turned the page of the journal and the handwriting changed mid-sentence — as if the writer had been replaced.', 1, 219, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.', 2, 222, true, 99);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Karelia Station', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

She turned the page of the journal and the handwriting changed mid-sentence — as if the writer had been replaced.

In the morning, the boat was gone, and so was the sound of the bell.', 3, 201, false, NULL);
  UPDATE public.manuscripts SET word_count = 839 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Talia Alves', bio='Trying to write the book my fifteen-year-old self needed. Edinburgh. [seed]', genres=ARRAY['Sci-Fi']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'An Inventory of Hotel of Inheritance', 'An astronaut, grounded by an injury, ghostwrites memoirs for the dying — until one of them starts writing back.', 'Sci-Fi', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'There is a particular kind of silence that follows a confession. Talia learned it that summer, in a kitchen that smelled of bergamot.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

Outside, the rain came in sheets so thick the streetlamps looked like drowned suns.', 0, 204, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

He counted his footsteps along the corridor, an old habit from a school he''d been told never to mention.', 1, 221, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

The phone rang once and stopped. They both pretended not to hear it.

Years later, when anyone asked, she would say only: ''It was a good summer. The best one. We meant it.''', 2, 199, false, NULL);
  UPDATE public.manuscripts SET word_count = 624 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Caleb Pavel', bio='Literary fiction from the kitchen table. Marseille. [seed]', genres=ARRAY['Thriller','Literary']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'A Map of Translator of Garden', 'Two estranged sisters reopen their grandmother''s bookshop and the rooms begin to remember things they don''t.', 'Romance', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'If there had been a god in that town, Caleb thought, he had retired and moved south.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The phone rang once and stopped. They both pretended not to hear it.', 0, 190, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

She had loved him the way one loves a country one has had to leave — gratefully, uneasily, with a small and permanent ache.', 1, 233, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He counted his footsteps along the corridor, an old habit from a school he''d been told never to mention.', 2, 220, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Karelia Station', 'There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

Snow began to fall, very slow at first, as if the sky were trying not to wake anyone.

The lighthouse blinked once. Then twice. Then steady, the way it always had.', 3, 187, true, 199);
  UPDATE public.manuscripts SET word_count = 830 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Cleo Petrov', bio='I write about quiet women doing loud things. Naples, occasionally. [seed]', genres=ARRAY['Romance','Fantasy','YA']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Before Borrowed Light', 'A romance, slow as snowmelt, between a pastry chef and the journalist sent to expose her father.', 'Historical', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The first rule of the orchard was simple: don''t eat anything that knows your name. Cleo broke it on a Tuesday.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

He counted his footsteps along the corridor, an old habit from a school he''d been told never to mention.', 0, 200, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.', 1, 219, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

He counted his footsteps along the corridor, an old habit from a school he''d been told never to mention.

She left the locket on the table and walked into the rest of her life.', 2, 190, false, NULL);
  UPDATE public.manuscripts SET word_count = 609 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Amara Mercer', bio='Stories about home and the people we leave behind. Kyoto. [seed]', genres=ARRAY['Horror','Memoir']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Quiet Cartographer', 'A retired translator falls in love with a letter he can''t deliver and the woman who wrote it.', 'Horror', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The day Amara disappeared, the sky turned the color of old brass. Nobody in the village said a word.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

She turned the page of the journal and the handwriting changed mid-sentence — as if the writer had been replaced.', 0, 198, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

Every map of the island lied about something. The honest ones lied about the same thing.

The river took what it had been promised, and gave back something neither of them had asked for.', 1, 203, false, NULL);
  UPDATE public.manuscripts SET word_count = 401 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Zara Larkin', bio='Writing slow novels in Kyoto. Tea, lighthouses, long walks. [seed]', genres=ARRAY['Fantasy','Historical']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Small Nightingale of Translator', 'A grieving cartographer returns to her childhood island and discovers the maps are wrong on purpose.', 'Literary', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The day Zara disappeared, the sky turned the color of old brass. Nobody in the village said a word.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.', 0, 196, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

She turned the page of the journal and the handwriting changed mid-sentence — as if the writer had been replaced.', 1, 222, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.

The river took what it had been promised, and gave back something neither of them had asked for.', 2, 198, false, NULL);
  UPDATE public.manuscripts SET word_count = 616 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Lila Solberg', bio='Romance, mostly. Mysteries, sometimes. Always cats. Porto. [seed]', genres=ARRAY['YA','Horror','Thriller']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'An Inventory of Auction', 'A literary thriller set during a long heatwave, in a town where everyone is keeping the same secret a little differently.', 'Fantasy', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'There is a particular kind of silence that follows a confession. Lila learned it that summer, in a kitchen that smelled of bergamot.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

She had loved him the way one loves a country one has had to leave — gratefully, uneasily, with a small and permanent ache.', 0, 210, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

She had loved him the way one loves a country one has had to leave — gratefully, uneasily, with a small and permanent ache.', 1, 226, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.

He laughed, finally, and the laughter sounded like a window opening.', 2, 187, false, NULL);
  UPDATE public.manuscripts SET word_count = 623 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Caleb Brun', bio='Stories about home and the people we leave behind. Reykjavík. [seed]', genres=ARRAY['YA','Fantasy','Mystery']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Small Tides', 'An astronaut, grounded by an injury, ghostwrites memoirs for the dying — until one of them starts writing back.', 'Memoir', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'There is a particular kind of silence that follows a confession. Caleb learned it that summer, in a kitchen that smelled of bergamot.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.', 0, 202, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.

In the morning, the boat was gone, and so was the sound of the bell.', 1, 192, false, NULL);
  UPDATE public.manuscripts SET word_count = 394 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Iris Holloway', bio='Reader first, writer second. Posting from Montréal. [seed]', genres=ARRAY['YA','Thriller','Fantasy']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Long Wintering of Tides', 'An astronaut, grounded by an injury, ghostwrites memoirs for the dying — until one of them starts writing back.', 'Horror', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'Iris never trusted the train. It always pulled into Karelia station two minutes late and left thirty seconds early — as if begging to lose someone.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.', 0, 211, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

He counted his footsteps along the corridor, an old habit from a school he''d been told never to mention.', 1, 222, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

Outside, the rain came in sheets so thick the streetlamps looked like drowned suns.

There would be other towns, other trains, other versions of the story. This one, at least, was hers.', 2, 191, false, NULL);
  UPDATE public.manuscripts SET word_count = 624 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Marisol Romero', bio='Author of two books and many drafts. Currently lost in Brooklyn. [seed]', genres=ARRAY['Romance','Sci-Fi','Historical']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Notes on Garden', 'A romance, slow as snowmelt, between a pastry chef and the journalist sent to expose her father.', 'Romance', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The map was older than the country it described. Marisol traced the rivers with a fingernail and felt them move.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

She turned the page of the journal and the handwriting changed mid-sentence — as if the writer had been replaced.', 0, 199, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.', 1, 217, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

Outside, the rain came in sheets so thick the streetlamps looked like drowned suns.', 2, 219, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Karelia Station', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.

He never wrote to her again. But every spring, on the day they had met, the lilacs bloomed too early — and he noticed.', 3, 205, true, 299);
  UPDATE public.manuscripts SET word_count = 840 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Nia Quiñones', bio='Stories about home and the people we leave behind. Seville. [seed]', genres=ARRAY['Fantasy','Romance','Historical']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'An Inventory of Tides of Burning', 'On the night of a small-town auction, an heirloom locket changes hands four times — and so does a secret.', 'Mystery', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The first rule of the orchard was simple: don''t eat anything that knows your name. Nia broke it on a Tuesday.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

She turned the page of the journal and the handwriting changed mid-sentence — as if the writer had been replaced.', 0, 201, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There were rooms in that house that opened only on certain afternoons, and only when you weren''t looking for them.', 1, 224, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

He counted his footsteps along the corridor, an old habit from a school he''d been told never to mention.

The lighthouse blinked once. Then twice. Then steady, the way it always had.', 2, 192, false, NULL);
  UPDATE public.manuscripts SET word_count = 617 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Quinn Faraj', bio='Reader first, writer second. Posting from Tallinn. [seed]', genres=ARRAY['Literary','Sci-Fi']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Quiet Northern Sky', 'An astronaut, grounded by an injury, ghostwrites memoirs for the dying — until one of them starts writing back.', 'Memoir', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The letter said: ''Come home. Bring nothing.'' That was enough — Quinn bought a one-way ticket the same hour.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

He counted his footsteps along the corridor, an old habit from a school he''d been told never to mention.', 0, 198, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

Snow began to fall, very slow at first, as if the sky were trying not to wake anyone.', 1, 215, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.', 2, 220, true, 199);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Karelia Station', 'The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

Snow began to fall, very slow at first, as if the sky were trying not to wake anyone.

The river took what it had been promised, and gave back something neither of them had asked for.', 3, 200, false, NULL);
  UPDATE public.manuscripts SET word_count = 833 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Quinn Halverson', bio='Trying to write the book my fifteen-year-old self needed. Mexico City. [seed]', genres=ARRAY['Historical','Thriller']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Before Hotel', 'A grieving cartographer returns to her childhood island and discovers the maps are wrong on purpose.', 'Horror', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The letter said: ''Come home. Bring nothing.'' That was enough — Quinn bought a one-way ticket the same hour.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

He poured the wine carefully, the way a priest pours communion, and they drank without speaking.', 0, 197, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

Outside, the rain came in sheets so thick the streetlamps looked like drowned suns.', 1, 219, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

Every map of the island lied about something. The honest ones lied about the same thing.

The river took what it had been promised, and gave back something neither of them had asked for.', 2, 197, false, NULL);
  UPDATE public.manuscripts SET word_count = 613 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Quinn Aoki', bio='Romance, mostly. Mysteries, sometimes. Always cats. Naples. [seed]', genres=ARRAY['Romance','Fantasy']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'Small Visitors', 'A teenage hacker uncovers a quiet conspiracy in her city''s transit system — and the man she''s been told to call uncle.', 'Historical', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The lighthouse hadn''t blinked in three nights. Quinn stood on the cliff and watched the dark water as if waiting for it to answer back.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

Every map of the island lied about something. The honest ones lied about the same thing.', 0, 206, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

Snow began to fall, very slow at first, as if the sky were trying not to wake anyone.', 1, 223, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

The bookshop smelled of rain and pencil shavings. A cat slept on a stack of unread Tolstoy. The owner, who had once been a translator and was now mostly a quiet man, looked up and nodded as if he had been expecting her.

Outside, the rain came in sheets so thick the streetlamps looked like drowned suns.

She left the locket on the table and walked into the rest of her life.', 2, 191, false, NULL);
  UPDATE public.manuscripts SET word_count = 620 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Cleo Vega', bio='Reader first, writer second. Posting from Edinburgh. [seed]', genres=ARRAY['YA']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'The Quiet Nightingale', 'An astronaut, grounded by an injury, ghostwrites memoirs for the dying — until one of them starts writing back.', 'Romance', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The map was older than the country it described. Cleo traced the rivers with a fingernail and felt them move.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.', 0, 198, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'He kept the letters in a tin that had once held biscuits from a wedding he had not attended. The tin was the only honest archive in the house. Everything else had been rearranged at least once for the sake of guests.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

Outside, the rain came in sheets so thick the streetlamps looked like drowned suns.', 1, 220, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Snowfall', 'They walked the long way home because the short way passed the house she no longer lived in. He didn''t ask why. After twenty years, certain questions are no longer the kind one asks; they are the kind one carries.

On the third evening, the stranger asked for a glass of water and stayed for sixteen years. This was the kind of thing that happened in that village; the locals had learned to accept it the way other places accept fog.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

The phone rang once and stopped. They both pretended not to hear it.

The lighthouse blinked once. Then twice. Then steady, the way it always had.', 2, 182, true, 199);
  UPDATE public.manuscripts SET word_count = 600 WHERE id = v_mid;
  v_uid := gen_random_uuid();
  PERFORM public._seed_create_user(v_uid, 'seed-' || replace(v_uid::text,'-','') || '@quill.local');
  UPDATE public.profiles SET pen_name='Zara Madden', bio='Romance, mostly. Mysteries, sometimes. Always cats. Marseille. [seed]', genres=ARRAY['Romance','Sci-Fi']::text[], onboarded=true WHERE id=v_uid;
  v_mid := gen_random_uuid();
  INSERT INTO public.manuscripts(id, author_id, title, synopsis, genre, status, word_count) VALUES (v_mid, v_uid, 'An Inventory of Wintering', 'A literary thriller set during a long heatwave, in a town where everyone is keeping the same secret a little differently.', 'YA', 'published', 0);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'Chapter 1', 'The letter said: ''Come home. Bring nothing.'' That was enough — Zara bought a one-way ticket the same hour.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

The garden refused to cooperate. The roses grew where the tomatoes were meant to be; the rosemary climbed the fence like it was trying to leave. She admired the garden for its ambition and gave up on her plan.

She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

He had been told, as a boy, that the seabirds carried messages between islands. He had not entirely stopped believing it. When the gulls turned inland in October, he watched them with the patient attention of someone expecting news.

Outside, the rain came in sheets so thick the streetlamps looked like drowned suns.', 0, 190, false, NULL);
  INSERT INTO public.chapters(manuscript_id, title, content, "order", word_count, is_paid, unlock_price_cents) VALUES (v_mid, 'The Letter', 'She had a theory, never written down, that every city is haunted by the version of itself it almost was. Her own city was haunted by a rainier, sleepier twin — one with more bridges and fewer reasons to leave.

There was a clock on the mantel that was always six minutes fast. Generations of the family had failed to fix it; finally they began to plan around it, the way people plan around an old, beloved, unreasonable relative.

There is a kind of friendship that survives only because nobody examines it too closely. Theirs had survived for almost a decade on exactly that principle, and they were both quietly grateful for the mutual cowardice.

The kitchen had two windows and one of them was always open, even in winter. It was a small rebellion against the weather and against her mother, who believed the cold should be respected. She had inherited the apartment and the rebellion in equal measure.

Memory is a kind of weather, he thought; it moves through you whether or not you''ve packed for it.

She left the locket on the table and walked into the rest of her life.', 1, 194, false, NULL);
  UPDATE public.manuscripts SET word_count = 384 WHERE id = v_mid;
END $$;


-- Likes & comments between seed profiles
DO $$
DECLARE
  m record;
  liker uuid;
  n_likes int;
  n_comments int;
  comment_bodies text[] := ARRAY[
    'This opening grabbed me — instant follow.',
    'Beautifully written. The pacing in chapter 2 is perfect.',
    'I read this in one sitting. More please.',
    'That last line. Wow.',
    'The atmosphere in this is so vivid I forgot where I was.',
    'Subscribed. Can''t wait for the next chapter.',
    'Reminds me of early Sally Rooney with a touch of Le Guin.',
    'Tipped — this deserves to be read by more people.',
    'The dialogue does so much heavy lifting here. Bravo.',
    'I keep thinking about the orchard scene. Haunting.'
  ];
BEGIN
  FOR m IN SELECT id, author_id FROM public.manuscripts WHERE status = 'published' AND author_id IN (SELECT id FROM public.profiles WHERE bio LIKE '%[seed]%') LOOP
    n_likes := 5 + floor(random() * 60)::int;
    FOR i IN 1..n_likes LOOP
      SELECT id INTO liker FROM public.profiles WHERE bio LIKE '%[seed]%' AND id <> m.author_id ORDER BY random() LIMIT 1;
      INSERT INTO public.likes(user_id, manuscript_id) VALUES (liker, m.id) ON CONFLICT DO NOTHING;
    END LOOP;
    n_comments := 1 + floor(random() * 4)::int;
    FOR i IN 1..n_comments LOOP
      SELECT id INTO liker FROM public.profiles WHERE bio LIKE '%[seed]%' AND id <> m.author_id ORDER BY random() LIMIT 1;
      INSERT INTO public.comments(user_id, manuscript_id, body) VALUES (liker, m.id, comment_bodies[1 + floor(random() * array_length(comment_bodies,1))::int]);
    END LOOP;
  END LOOP;

  -- Follows: each seed author follows ~5 others
  FOR m IN SELECT id FROM public.profiles WHERE bio LIKE '%[seed]%' LOOP
    FOR i IN 1..(3 + floor(random()*6)::int) LOOP
      SELECT id INTO liker FROM public.profiles WHERE bio LIKE '%[seed]%' AND id <> m.id ORDER BY random() LIMIT 1;
      INSERT INTO public.follows(follower_id, following_id) VALUES (m.id, liker) ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;
