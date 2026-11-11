-- Songs INSERT (80 songs)
INSERT INTO songs (id, title, artist, album, genre, year, image_url, preview_url, apple_music_url) VALUES
  (gen_random_uuid(), 'Wonderwall', 'Oasis', 'Wonderwall', 'Rock', 1995, 'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/04/92/e0/0492e08b-cbcc-9969-9ad6-8f5a0888068c/5051961007107.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ab/16/93/ab16933c-6203-3db9-9da9-513ff1c8496d/mzaf_16993612140334549994.plus.aac.p.m4a', 'https://music.apple.com/us/album/wonderwall/1517447039?i=1517447333&uo=4'),
  (gen_random_uuid(), 'Champagne Supernova', 'Oasis', 'Champagne Supernova', 'Rock', 1995, 'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/04/92/e0/0492e08b-cbcc-9969-9ad6-8f5a0888068c/5051961007107.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/26/5b/a4/265ba488-b2d6-4167-c7e7-d5e742c127f1/mzaf_3887073145349385194.plus.aac.p.m4a', 'https://music.apple.com/us/album/champagne-supernova/1517447039?i=1517447869&uo=4'),
  (gen_random_uuid(), 'Yellow', 'Coldplay', 'Yellow', 'Rock', 2000, 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f5/93/8c/f5938c49-964c-31d1-4b33-78b634f71fb7/190295978075.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/66/f3/1a/66f31a76-a6ed-cb4c-f353-23310a7ae9a8/mzaf_10593596652344378873.plus.aac.p.m4a', 'https://music.apple.com/us/album/yellow/1122782080?i=1122782283&uo=4'),
  (gen_random_uuid(), 'The Scientist', 'Coldplay', 'The Scientist', 'Rock', 2002, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b9/b4/2a/b9b42ad1-1e25-5096-da43-497a247e69a3/190295978051.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ae/a6/27/aea62715-e6ae-9562-ba81-1f969a2ee2fa/mzaf_9054259057357054559.plus.aac.p.m4a', 'https://music.apple.com/us/album/the-scientist/1122775993?i=1122776155&uo=4'),
  (gen_random_uuid(), 'Fix You', 'Coldplay', 'Fix You', 'Rock', 2005, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/0c/82/48/0c8248a8-4a5b-d30d-8056-f32d650d2fc9/190295978068.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e5/42/e3/e542e340-a45c-695e-e0b8-6155e222ebc0/mzaf_14955746616030397665.plus.aac.p.m4a', 'https://music.apple.com/us/album/fix-you/1123076757?i=1123076826&uo=4'),
  (gen_random_uuid(), 'Viva la Vida', 'Coldplay', 'Viva la Vida', 'Rock', 2008, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/52/aa/85/52aa851f-15b7-6322-f91f-df84b15b7b19/190295978044.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/2b/04/65/2b0465c3-2db1-e461-2362-14b528456b8f/mzaf_1805426141027060154.plus.aac.p.m4a', 'https://music.apple.com/us/album/viva-la-vida/1122773394?i=1122773680&uo=4'),
  (gen_random_uuid(), 'Every Breath You Take', 'The Police', 'Every Breath You Take', 'Rock', 1983, 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/42/b7/db/42b7dbe1-d13f-c600-5b78-daa57c5d0f08/06UMGIM50761.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/6c/b4/79/6cb47947-0860-8788-95b1-a2b0a908f342/mzaf_4654925634744235278.plus.aac.p.m4a', 'https://music.apple.com/us/album/every-breath-you-take/1440882817?i=1440882897&uo=4'),
  (gen_random_uuid(), 'Roxanne', 'The Police', 'Roxanne', 'Rock', 1978, 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/42/b7/db/42b7dbe1-d13f-c600-5b78-daa57c5d0f08/06UMGIM50761.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/64/ef/d6/64efd6bd-6d64-1eb8-c369-c8c364a91286/mzaf_15898822718298618699.plus.aac.p.m4a', 'https://music.apple.com/us/album/roxanne/1440882817?i=1440883524&uo=4'),
  (gen_random_uuid(), 'Message in a Bottle', 'The Police', 'Message in a Bottle', 'Rock', 1979, 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/74/2a/da/742ada22-9a00-1620-b72e-6667745b010a/16UMGIM60881.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/48/b0/a5/48b0a569-d4a1-2605-e7b5-c5088a7d6b49/mzaf_1984960004193242977.plus.aac.p.m4a', 'https://music.apple.com/us/album/message-in-a-bottle-remastered-2003/1440744161?i=1440744163&uo=4'),
  (gen_random_uuid(), 'Should I Stay or Should I Go', 'The Clash', 'Should I Stay or Should I Go', 'Rock', 1982, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/71/b6/8a/71b68ab0-f2d7-5cf0-636c-c27de6ce8aed/886443520707.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/2a/81/23/2a8123dd-9b78-cd6e-c802-a8ccc2d7fbad/mzaf_17446670162302022873.plus.aac.p.m4a', 'https://music.apple.com/us/album/should-i-stay-or-should-i-go/685585931?i=685585941&uo=4'),
  (gen_random_uuid(), 'London Calling', 'The Clash', 'London Calling', 'Rock', 1979, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/45/d7/17/45d71740-b204-de23-3f9e-f2f823296f1d/886443520721.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/fb/f5/b4/fbf5b472-dd9d-5984-c8c5-114716c105cb/mzaf_14673080368047782781.plus.aac.p.m4a', 'https://music.apple.com/us/album/london-calling/684811762?i=684811768&uo=4'),
  (gen_random_uuid(), 'Come as You Are', 'Nirvana', 'Come as You Are', 'Rock', 1991, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/fd/b9/95fdb9b2-6d2b-92a6-97f2-51c1a6d77f1a/00602527874609.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/f4/3e/86/f43e8664-bdd9-bc56-8d2b-76064c865920/mzaf_15456055651529260945.plus.aac.p.m4a', 'https://music.apple.com/us/album/come-as-you-are/1440783617?i=1440783636&uo=4'),
  (gen_random_uuid(), 'In Bloom', 'Nirvana', 'In Bloom', 'Rock', 1991, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/fd/b9/95fdb9b2-6d2b-92a6-97f2-51c1a6d77f1a/00602527874609.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/fc/a2/f6/fca2f601-ace6-1dc2-147e-30b75d84f8dc/mzaf_6185719562680140601.plus.aac.p.m4a', 'https://music.apple.com/us/album/in-bloom/1440783617?i=1440783633&uo=4'),
  (gen_random_uuid(), 'Jeremy', 'Pearl Jam', 'Jeremy', 'Rock', 1991, 'https://is1-ssl.mzstatic.com/image/thumb/Features6/v4/76/af/5d/76af5df5-8f03-6ed7-5207-440ae2b80e94/dj.pxyseetm.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b2/0f/7f/b20f7fef-c00d-c07b-7360-e7ff61dea320/mzaf_2613626414238008290.plus.aac.p.m4a', 'https://music.apple.com/us/album/jeremy-radio-edit/400864982?i=400864985&uo=4'),
  (gen_random_uuid(), 'Alive', 'Pearl Jam', 'Alive', 'Rock', 1991, 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e0/e1/7c/e0e17cf0-62e5-6312-f3df-2462960cc8f1/884977724745.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/37/7f/14/377f14d3-61d3-471f-d21b-2f11f49467cc/mzaf_6667861949058372764.plus.aac.p.m4a', 'https://music.apple.com/us/album/alive/425465247?i=425465319&uo=4'),
  (gen_random_uuid(), 'Killing in the Name', 'Rage Against the Machine', 'Killing in the Name', 'Rock', 1992, 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3b/7b/17/3b7b1762-04bc-a9e9-4f5c-93946b13b727/886448670452.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/52/f5/e6/52f5e648-d504-d6d8-a3f4-a2f40db68326/mzaf_8855636367189570390.plus.aac.p.m4a', 'https://music.apple.com/us/album/killing-in-the-name-live-at-2000-democratic-national/1773340098?i=1773340317&uo=4'),
  (gen_random_uuid(), 'Bulls on Parade', 'Rage Against the Machine', 'Bulls on Parade', 'Rock', 1996, 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/a8/f4/33/a8f433a7-2b81-0447-60ed-2538d539b33c/artwork.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/e2/99/88/e299886c-31ea-ecb4-faae-0416d6542e64/mzaf_16800542739466073785.plus.aac.p.m4a', 'https://music.apple.com/us/album/bulls-on-parade/1596281494?i=1596281495&uo=4'),
  (gen_random_uuid(), 'Like a Stone', 'Audioslave', 'Like a Stone', 'Rock', 2002, 'https://is1-ssl.mzstatic.com/image/thumb/Features115/v4/9c/b6/c2/9cb6c246-3626-7789-26a9-79b787e5668d/dj.owymmnty.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/45/c5/a4/45c5a454-85c9-dc43-6d42-b86ff48964b7/mzaf_792093563240187454.plus.aac.p.m4a', 'https://music.apple.com/us/album/like-a-stone/208294748?i=208294873&uo=4'),
  (gen_random_uuid(), 'Piano Man', 'Billy Joel', 'Piano Man', 'Rock', 1973, 'https://is1-ssl.mzstatic.com/image/thumb/Features125/v4/67/f9/8d/67f98d03-7896-153f-4965-a92458c06965/dj.aiuntmgo.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8e/e4/51/8ee451b3-a74e-25fa-be4e-09ce04a39df0/mzaf_13595078232063121698.plus.aac.p.m4a', 'https://music.apple.com/us/album/piano-man/158617297?i=158617575&uo=4'),
  (gen_random_uuid(), 'Livin'' on a Prayer', 'Bon Jovi', 'Livin'' on a Prayer', 'Rock', 1986, 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/40/16/3e/40163e24-6985-b785-d4ea-cbae07d74812/06UMGIM05422.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/75/15/30/75153020-b7c4-7958-8907-4aa1b965dc24/mzaf_2377504467597068152.plus.aac.p.m4a', 'https://music.apple.com/us/album/livin-on-a-prayer/1422954626?i=1422955211&uo=4'),
  (gen_random_uuid(), 'You Give Love a Bad Name', 'Bon Jovi', 'You Give Love a Bad Name', 'Rock', 1986, 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/40/16/3e/40163e24-6985-b785-d4ea-cbae07d74812/06UMGIM05422.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/15/3f/80/153f8055-1bc2-d175-a256-0551a72e1300/mzaf_7956543147956949979.plus.aac.p.m4a', 'https://music.apple.com/us/album/you-give-love-a-bad-name/1422954626?i=1422954999&uo=4'),
  (gen_random_uuid(), 'Eye of the Tiger', 'Survivor', 'Eye of the Tiger', 'Rock', 1982, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f9/02/8f/f9028f63-7a55-235e-f789-1e8946430fa2/614223201122.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fe/fa/9e/fefa9edd-c023-4d1c-1012-08bfb0ec69e6/mzaf_4651653238471209843.plus.aac.p.m4a', 'https://music.apple.com/us/album/eye-of-the-tiger/254685010?i=254685026&uo=4'),
  (gen_random_uuid(), 'Take On Me', 'A-ha', 'Take On Me', 'Pop', 1985, 'https://is1-ssl.mzstatic.com/image/thumb/Music/c6/e1/c8/mzi.ixgzfcmc.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f2/03/4f/f2034f41-707f-7111-bc63-e5d3cf7f2240/mzaf_17215043934336702540.plus.aac.p.m4a', 'https://music.apple.com/us/album/take-on-me/380907762?i=380907765&uo=4'),
  (gen_random_uuid(), 'Tainted Love', 'Soft Cell', 'Tainted Love', 'Pop', 1981, 'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/70/ff/8c/70ff8c59-95dc-5444-fd3b-81204d0477e5/00600753223598.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/59/ad/28/59ad2888-2b61-7f07-a779-b18cc013c698/mzaf_5227993960460210837.plus.aac.p.m4a', 'https://music.apple.com/us/album/tainted-love/1440517668?i=1440517679&uo=4'),
  (gen_random_uuid(), 'Don''t You (Forget About Me)', 'Simple Minds', 'Don''t You (Forget About Me)', 'Rock', 1985, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/28/6e/43/286e43ed-12e3-f007-966f-ebd6c25b96bf/15UMGIM42148.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/dc/9b/71/dc9b71df-75e4-a928-6821-97a0b9ef5ec4/mzaf_12527181772900682936.plus.aac.p.m4a', 'https://music.apple.com/us/album/dont-you-forget-about-me/1443233330?i=1443234020&uo=4'),
  (gen_random_uuid(), 'Girls Just Want to Have Fun', 'Cyndi Lauper', 'Girls Just Want to Have Fun', 'Pop', 1983, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/8a/8c/13/8a8c13e0-06af-1710-7b7d-ebec65fb8361/074643893022.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/95/1d/ed/951ded3d-4e31-1452-42b6-cc36070a2204/mzaf_10794841548233618528.plus.aac.p.m4a', 'https://music.apple.com/us/album/girls-just-want-to-have-fun/400603643?i=400603693&uo=4'),
  (gen_random_uuid(), 'Total Eclipse of the Heart', 'Bonnie Tyler', 'Total Eclipse of the Heart', 'Pop', 1983, 'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/00/94/32/0094321d-fc26-c617-b0f5-7f6e24c6d921/886448355717.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/a5/94/8c/a5948c77-000c-e25b-8133-a36103ded80e/mzaf_14404435220764766921.plus.aac.p.m4a', 'https://music.apple.com/us/album/total-eclipse-of-the-heart/1504101039?i=1504101382&uo=4'),
  (gen_random_uuid(), 'All Along the Watchtower', 'Jimi Hendrix', 'All Along the Watchtower', 'Rock', 1968, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/a6/b8/45/a6b84589-6ff7-a462-9ff9-170b724980d5/dj.wjkdwlks.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a7/58/ce/a758ce2a-f3b7-c70f-4d38-8ec933f5c838/mzaf_9944636089902578417.plus.aac.p.m4a', 'https://music.apple.com/us/album/all-along-the-watchtower/357652252?i=357653191&uo=4'),
  (gen_random_uuid(), 'Purple Haze', 'Jimi Hendrix', 'Purple Haze', 'Rock', 1967, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/53/e9/b9/53e9b9f0-97f4-aac7-ee5b-12c2f2007ad3/884977413878.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/bf/ba/6a/bfba6aa6-40a8-f2f8-8246-2e51041fb0cf/mzaf_10404999512672940742.plus.aac.p.m4a', 'https://music.apple.com/us/album/purple-haze/344799413?i=344799464&uo=4'),
  (gen_random_uuid(), 'Light My Fire', 'The Doors', 'Light My Fire', 'Rock', 1967, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/43/f6/14/43f61467-931b-21af-6b22-13717edc8ed9/603497870295.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/3d/cd/ce/3dcdceab-7458-a9dd-7c3f-72b69a9fffc6/mzaf_9831581320710671416.plus.aac.p.m4a', 'https://music.apple.com/us/album/light-my-fire/1192962129?i=1192962303&uo=4'),
  (gen_random_uuid(), 'Brown Eyed Girl', 'Van Morrison', 'Brown Eyed Girl', 'Rock', 1967, 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/dd/0e/bc/dd0ebcee-9d50-fe99-4ef8-c0fb79932511/886445621334_Cover.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b8/5e/01/b85e0137-21d0-a265-b2e1-40d3c67a5d94/mzaf_1618708767076233365.plus.aac.p.m4a', 'https://music.apple.com/us/album/brown-eyed-girl/1838782090?i=1838782096&uo=4'),
  (gen_random_uuid(), 'Sympathy for the Devil', 'The Rolling Stones', 'Sympathy for the Devil', 'Rock', 1968, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/a3/d1/78/a3d178a8-f1c2-c1c3-1c5d-d78ab3af9768/20UMGIM13726.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1b/f7/73/1bf77304-235f-3f02-c126-fac9a5aa9917/mzaf_4625747673195165829.plus.aac.p.m4a', 'https://music.apple.com/us/album/sympathy-for-the-devil/1500643395?i=1500643398&uo=4'),
  (gen_random_uuid(), 'Gimme Shelter', 'The Rolling Stones', 'Gimme Shelter', 'Rock', 1969, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/69/64/67/696467fe-9ed1-b65e-1016-a10d07e6464d/20UMGIM14087.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4e/e5/10/4ee51039-55ec-0f60-30da-be26a19d5ce1/mzaf_8054372248147236391.plus.aac.p.m4a', 'https://music.apple.com/us/album/gimme-shelter-remastered-2019/1500642838?i=1500642840&uo=4'),
  (gen_random_uuid(), 'Don''t Stop Me Now', 'Queen', 'Don''t Stop Me Now', 'Rock', 1978, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4d/08/2a/4d082a9e-7898-1aa1-a02f-339810058d9e/14DMGIM05632.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/6a/ec/92/6aec920f-5a05-d93b-ceaa-7de19cdbae88/mzaf_6658285650704260274.plus.aac.p.m4a', 'https://music.apple.com/us/album/dont-stop-me-now/1440650428?i=1440650733&uo=4'),
  (gen_random_uuid(), 'We Are the Champions', 'Queen', 'We Are the Champions', 'Rock', 1977, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4d/08/2a/4d082a9e-7898-1aa1-a02f-339810058d9e/14DMGIM05632.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8c/b9/38/8cb93818-d1d3-7093-8679-5a42c261b429/mzaf_826149797423692231.plus.aac.p.m4a', 'https://music.apple.com/us/album/we-are-the-champions/1440650428?i=1440651281&uo=4'),
  (gen_random_uuid(), 'Under Pressure', 'Queen', 'Under Pressure', 'Rock', 1981, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/04/96/71/04967171-a370-df71-c632-82ebba719c97/14DMGIM05609.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/74/42/5f/74425f2e-4c63-0514-951a-891ad9753097/mzaf_3082293095615590695.plus.aac.p.m4a', 'https://music.apple.com/us/album/under-pressure/1440805941?i=1440806739&uo=4'),
  (gen_random_uuid(), 'Life on Mars?', 'David Bowie', 'Life on Mars?', 'Rock', 1971, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f0/b9/68/f0b9680e-b028-b3d6-f793-7c268256499a/825646286034.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/63/6b/06/636b0642-5636-af2c-06e1-bb0dabdefcb7/mzaf_16026243431927840611.plus.aac.p.m4a', 'https://music.apple.com/us/album/life-on-mars/1039798000?i=1039798013&uo=4'),
  (gen_random_uuid(), 'Ziggy Stardust', 'David Bowie', 'Ziggy Stardust', 'Rock', 1972, 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/5f/fa/56/5ffa56c2-ea1f-7a17-6bad-192ff9b6476d/825646124206.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/aa/ec/07/aaec07bf-f18e-3177-a197-414b5438010f/mzaf_7317737316865701540.plus.aac.p.m4a', 'https://music.apple.com/us/album/ziggy-stardust-2012-remaster/1039796877?i=1039797286&uo=4'),
  (gen_random_uuid(), 'Stan', 'Eminem', 'Stan', 'Hip Hop', 2000, 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/a7/06/99/a70699f9-2f5a-9198-fe70-6236b534738f/06UMGIM16683.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3f/83/1e/3f831e96-1a9e-d93d-6b12-067aecfbc980/mzaf_2716700356726004691.plus.aac.p.m4a', 'https://music.apple.com/us/album/stan-live-at-43rd-grammy-awards/1445726870?i=1445727516&uo=4'),
  (gen_random_uuid(), 'Without Me', 'Eminem', 'Without Me', 'Hip Hop', 2002, 'https://is1-ssl.mzstatic.com/image/thumb/Music118/v4/dd/5c/e6/dd5ce621-f7d2-f767-7a08-e7a7eaa7870b/00602537526994.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/7d/38/ff/7d38ff16-b52c-063a-a34d-767e836befcc/mzaf_13413071545825673354.plus.aac.p.m4a', 'https://music.apple.com/us/album/without-me/1440821542?i=1440821643&uo=4'),
  (gen_random_uuid(), '99 Problems', 'Jay-Z', '99 Problems', 'Hip Hop', 2003, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/88/8c/69/888c694c-39ab-4527-beb1-8a8348592586/mzi.ffeoqoaj.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/a5/24/6a/a5246a18-7371-0cdb-eca2-187dd6e64324/mzaf_11487730679118356371.plus.aac.p.m4a', 'https://music.apple.com/us/album/99-problems/433874599?i=433874601&uo=4'),
  (gen_random_uuid(), 'Empire State of Mind', 'Jay-Z', 'Empire State of Mind', 'Hip Hop', 2009, 'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/b7/77/66/b77766d8-c73f-8a5d-376d-926db33475f7/884977002508.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2f/ca/55/2fca55a2-ca85-4d7c-4565-8dbcdcbf5c76/mzaf_2283598682877847189.plus.aac.p.m4a', 'https://music.apple.com/us/album/empire-state-of-mind-pt-2/341321353?i=341321703&uo=4'),
  (gen_random_uuid(), 'Hotline Bling', 'Drake', 'Hotline Bling', 'Hip Hop', 2015, NULL, NULL, NULL),
  (gen_random_uuid(), 'One Dance', 'Drake', 'One Dance', 'Hip Hop', 2016, NULL, NULL, NULL),
  (gen_random_uuid(), 'Umbrella', 'Rihanna', 'Umbrella', 'R&B', 2007, 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2b/c0/81/2bc081c8-25f0-ba43-d451-587a54613778/16UMGIM59202.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/7b/45/22/7b452241-882c-409b-3a9b-23306b14286a/mzaf_8588243939716013218.plus.aac.p.m4a', 'https://music.apple.com/us/album/umbrella-feat-ja%C3%BF-z/1441154435?i=1441154437&uo=4'),
  (gen_random_uuid(), 'We Found Love', 'Rihanna', 'We Found Love', 'R&B', 2011, 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/74/23/7b/74237b93-8346-5fe1-b1eb-938808910c5d/11UMGIM38936.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/81/4e/9f/814e9f54-e7f8-3ab1-d92e-c7869efbd376/mzaf_9149255715038044431.plus.aac.p.m4a', 'https://music.apple.com/us/album/we-found-love-feat-calvin-harris/1440758930?i=1440758945&uo=4'),
  (gen_random_uuid(), 'Diamonds', 'Rihanna', 'Diamonds', 'R&B', 2012, 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/a0/1a/10/a01a1080-7b1d-e475-a03c-394e5cbba66c/12UMGIM53876.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/26/97/fb/2697fb36-8ef2-9d18-0a2e-6545947b4445/mzaf_9032202105098805603.plus.aac.p.m4a', 'https://music.apple.com/us/album/diamonds/1444320940?i=1444321282&uo=4'),
  (gen_random_uuid(), 'Work', 'Rihanna', 'Work', 'R&B', 2016, 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/13/27/57/132757ba-42e6-9584-7390-ca694292a20e/16UMGIM03372.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/95/27/c5/9527c58a-b72d-c09e-51c8-0c36531f44a4/mzaf_16889711813657214394.plus.aac.p.m4a', 'https://music.apple.com/us/album/work-feat-drake/1443230958?i=1443231169&uo=4'),
  (gen_random_uuid(), '...Baby One More Time', 'Britney Spears', '...Baby One More Time', 'Pop', 1998, 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/51/73/28/5173280b-9b5e-c5e4-d3f8-a2612d044543/888880423368.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2a/ef/e5/2aefe5c7-e83b-07b1-227e-117347aa3006/mzaf_11333878250757508664.plus.aac.p.m4a', 'https://music.apple.com/us/album/baby-one-more-time/273143723?i=273143820&uo=4'),
  (gen_random_uuid(), 'Toxic', 'Britney Spears', 'Toxic', 'Pop', 2003, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/38/8b/7a/388b7a8f-10ff-a4e0-7624-65e29ac6a793/828765374828.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ae/c4/7f/aec47f56-842d-49b4-558b-7a7523fd6728/mzaf_6693111381462300599.plus.aac.p.m4a', 'https://music.apple.com/us/album/toxic/251947909?i=251948354&uo=4'),
  (gen_random_uuid(), 'Wrecking Ball', 'Miley Cyrus', 'Wrecking Ball', 'Pop', 2013, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e3/e0/84/e3e08400-2d03-75f9-6b8b-a3345452aa98/886444197816.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f8/e8/a2/f8e8a23c-b85d-17dd-9625-b39ec26b171f/mzaf_1866607988873686159.plus.aac.p.m4a', 'https://music.apple.com/us/album/wrecking-ball/1460315055?i=1460315319&uo=4'),
  (gen_random_uuid(), 'Roar', 'Katy Perry', 'Roar', 'Pop', 2013, 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/36/21/81/36218129-51b4-df22-cafb-8e9503b53147/13UAAIM70445.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/21/a8/76/21a87607-1fe3-2bd2-753c-0b4b73c22b90/mzaf_9666996724668759977.plus.aac.p.m4a', 'https://music.apple.com/us/album/roar/1440818542?i=1440818897&uo=4'),
  (gen_random_uuid(), 'Firework', 'Katy Perry', 'Firework', 'Pop', 2010, 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c8/d3/42/c8d342af-26d9-3ec2-c511-e1eaf860e299/13UABIM57787.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ab/27/3b/ab273b22-1eb1-dd49-5332-5ef70c35683b/mzaf_4912325324633099647.plus.aac.p.m4a', 'https://music.apple.com/us/album/firework/716192216?i=716192625&uo=4'),
  (gen_random_uuid(), 'Hello', 'Adele', 'Hello', 'Pop', 2015, 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/08/8c/24/088c2405-2e33-801b-5c38-e967f2c01e69/191404113974.png/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/93/22/22/93222271-8d55-d923-e0ff-b2964a5abefe/mzaf_3513742103157153222.plus.aac.p.m4a', 'https://music.apple.com/us/album/hello/1544494115?i=1544494392&uo=4'),
  (gen_random_uuid(), 'Set Fire to the Rain', 'Adele', 'Set Fire to the Rain', 'Pop', 2011, 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/eb/ca/25/ebca2596-cd1e-b295-91a3-771c868d0a79/191404113868.png/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/81/19/83/811983ba-173c-84f4-4058-fae8340abcdf/mzaf_13432775834568786807.plus.aac.p.m4a', 'https://music.apple.com/us/album/set-fire-to-the-rain/1544491232?i=1544491988&uo=4'),
  (gen_random_uuid(), 'Skyfall', 'Adele', 'Skyfall', 'Pop', 2012, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/b3/fe/cf/b3fecf76-0359-8e14-0651-4b101fc68a3f/886443673632.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/a8/f3/65/a8f365f6-9046-8e0a-78ba-5fa964b57ab6/mzaf_8633278038526787975.plus.aac.p.m4a', 'https://music.apple.com/us/album/skyfall/566322358?i=566322365&uo=4'),
  (gen_random_uuid(), 'Single Ladies (Put a Ring on It)', 'Beyonce', 'Single Ladies', 'R&B', 2008, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/35/0f/55/350f55da-2104-162a-5872-cb35fef30410/mzi.morbeoaw.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/00/78/8d/00788daa-ae6e-0fef-d26f-e9c9d9d22f26/mzaf_1876018181007650438.plus.aac.p.m4a', 'https://music.apple.com/us/album/single-ladies-put-a-ring-on-it/296016891?i=296016899&uo=4'),
  (gen_random_uuid(), 'Halo', 'Beyonce', 'Halo', 'R&B', 2008, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/35/0f/55/350f55da-2104-162a-5872-cb35fef30410/mzi.morbeoaw.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/a4/4e/1c/a44e1cce-6df2-b9c9-8915-35f7f03c7830/mzaf_2947807885494696932.plus.aac.p.m4a', 'https://music.apple.com/us/album/halo/296016891?i=296016893&uo=4'),
  (gen_random_uuid(), 'Irreplaceable', 'Beyonce', 'Irreplaceable', 'R&B', 2006, NULL, NULL, NULL),
  (gen_random_uuid(), 'Perfect', 'Ed Sheeran', 'Perfect', 'Pop', 2017, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/15/e6/e8/15e6e8a4-4190-6a8b-86c3-ab4a51b88288/190295851286.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c7/ba/bc/c7babc66-f598-aaa6-bcf6-307281795817/mzaf_16337361235117168274.plus.aac.p.m4a', 'https://music.apple.com/us/album/perfect/1193701079?i=1193701400&uo=4'),
  (gen_random_uuid(), 'Thinking Out Loud', 'Ed Sheeran', 'Thinking Out Loud', 'Pop', 2014, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2d/36/f9/2d36f9a7-2c3e-ce0f-7fb6-036feecb221f/825646974450.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/78/a5/f2/78a5f25e-ad1b-718d-82ad-b82e676c1855/mzaf_6133970271589343093.plus.aac.p.m4a', 'https://music.apple.com/us/album/thinking-out-loud/1050204616?i=1050204631&uo=4'),
  (gen_random_uuid(), 'Love Yourself', 'Justin Bieber', 'Love Yourself', 'Pop', 2015, 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/75/11/84/751184b0-77df-1eff-bb20-dac03247425d/15UMGIM59808.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b6/fc/58/b6fc5860-ee45-7966-3e22-d6445acc933e/mzaf_1716189482689106429.plus.aac.p.m4a', 'https://music.apple.com/us/album/love-yourself/1440829460?i=1440829613&uo=4'),
  (gen_random_uuid(), 'With or Without You', 'U2', 'With or Without You', 'Rock', 1987, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9a/48/54/9a485494-b969-aaf4-a916-07452ea69869/06UMGIM72507.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/77/08/84/77088446-6e2d-e624-a959-ba44f81c539f/mzaf_10549980225388125542.plus.aac.p.m4a', 'https://music.apple.com/us/album/with-or-without-you/1440729856?i=1440729860&uo=4'),
  (gen_random_uuid(), 'One', 'U2', 'One', 'Rock', 1991, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9a/48/54/9a485494-b969-aaf4-a916-07452ea69869/06UMGIM72507.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/80/d6/ad/80d6ad67-3920-ffb2-a3c9-e76c0428cd31/mzaf_8418791865712780774.plus.aac.p.m4a', 'https://music.apple.com/us/album/one/1440729856?i=1440729871&uo=4'),
  (gen_random_uuid(), 'Where the Streets Have No Name', 'U2', 'Where the Streets Have No Name', 'Rock', 1987, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9a/48/54/9a485494-b969-aaf4-a916-07452ea69869/06UMGIM72507.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/63/5e/cc/635eccad-a649-045d-9df3-a7908146feca/mzaf_2151432259740642438.plus.aac.p.m4a', 'https://music.apple.com/us/album/where-the-streets-have-no-name-new-edit-u218/1440729856?i=1440729868&uo=4'),
  (gen_random_uuid(), 'Dancing Queen', 'ABBA', 'Dancing Queen', 'Pop', 1976, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/60/f8/a6/60f8a6bc-e875-238d-f2f8-f34a6034e6d2/14UMGIM07615.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1a/47/93/1a4793fc-1586-87bc-00d2-dc4916a61c7c/mzaf_13920610926910283055.plus.aac.p.m4a', 'https://music.apple.com/us/album/dancing-queen/1422648512?i=1422648513&uo=4'),
  (gen_random_uuid(), 'Waterloo', 'ABBA', 'Waterloo', 'Pop', 1974, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/60/f8/a6/60f8a6bc-e875-238d-f2f8-f34a6034e6d2/14UMGIM07615.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/32/ca/2b/32ca2b0a-79a1-77ad-4746-07a83639d3ce/mzaf_9127813743185986422.plus.aac.p.m4a', 'https://music.apple.com/us/album/waterloo/1422648512?i=1422649021&uo=4'),
  (gen_random_uuid(), 'Mamma Mia', 'ABBA', 'Mamma Mia', 'Pop', 1975, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/8a/5d/a4/8a5da415-562c-c7f3-0801-2bd251947ac3/14UMGIM07609.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b6/11/b6/b611b634-d2ea-3413-19be-b3c19daddfe5/mzaf_11228048896593074702.plus.aac.p.m4a', 'https://music.apple.com/us/album/mamma-mia/1440861160?i=1440861294&uo=4'),
  (gen_random_uuid(), 'Let''s Stay Together', 'Al Green', 'Let''s Stay Together', 'Soul', 1972, 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/d8/ec/4f/d8ec4f92-0691-9151-1738-9fbe2e19a270/886445144888.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a1/cc/b3/a1ccb365-d4a7-f371-7e6c-c4b745b41acc/mzaf_2282300440028225493.plus.aac.p.m4a', 'https://music.apple.com/us/album/lets-stay-together/976362815?i=976362823&uo=4'),
  (gen_random_uuid(), 'Ain''t No Mountain High Enough', 'Marvin Gaye', 'Ain''t No Mountain High Enough', 'Soul', 1967, 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9b/c1/cf/9bc1cf3a-84c7-474e-2d0f-2e4bd0327377/06UMGIM11763.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ee/21/08/ee21080d-7903-f259-0e93-59eefcadb3f6/mzaf_17182042823728785336.plus.aac.p.m4a', 'https://music.apple.com/us/album/aint-no-mountain-high-enough/1442021816?i=1442021830&uo=4'),
  (gen_random_uuid(), 'What''s Going On', 'Marvin Gaye', 'What''s Going On', 'Soul', 1971, 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/76/36/2d/76362d74-cb7a-8ef9-104e-cde1d858e9a9/20UMGIM95279.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/08/f3/f4/08f3f452-b24f-e25b-92bc-15850f1bdc6a/mzaf_14002930736666872327.plus.aac.p.m4a', 'https://music.apple.com/us/album/whats-going-on/1538081586?i=1538081594&uo=4'),
  (gen_random_uuid(), 'I Heard It Through the Grapevine', 'Marvin Gaye', 'I Heard It Through the Grapevine', 'Soul', 1968, 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/d9/95/96/d9959694-4a83-4cf4-63bf-f174faac4df5/14UMGIM55417.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/87/8c/ef/878cefad-12ce-69e0-8551-b0aec462f266/mzaf_6893042827099943735.plus.aac.p.m4a', 'https://music.apple.com/us/album/i-heard-it-through-the-grapevine/1444106058?i=1444106658&uo=4'),
  (gen_random_uuid(), 'Tennessee Whiskey', 'Chris Stapleton', 'Tennessee Whiskey', 'Country', 2015, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e2/4b/60/e24b6016-8278-bb18-cf5d-d44bf68371da/00602547223838.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e3/7e/a3/e37ea341-37f0-9dcb-4d6a-e3f0a2c1ae26/mzaf_2775390428315622059.plus.aac.p.m4a', 'https://music.apple.com/us/album/tennessee-whiskey/1440827477?i=1440827492&uo=4'),
  (gen_random_uuid(), 'Friends in Low Places', 'Garth Brooks', 'Friends in Low Places', 'Country', 1990, 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b2/47/20/b24720e4-e805-c3dd-b90f-a06be88e6357/055120922367.png/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/45/71/b4/4571b4f0-8d22-584b-b24d-ebb05ecb1d49/mzaf_4785879350369271784.plus.aac.p.m4a', 'https://music.apple.com/us/album/friends-in-low-places/1704861945?i=1704862193&uo=4'),
  (gen_random_uuid(), 'Before He Cheats', 'Carrie Underwood', 'Before He Cheats', 'Country', 2005, 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/e7/14/80/e714805d-8aff-9e66-b25f-c75e5683a130/mzi.omppwbeg.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/0d/f9/89/0df98967-9b3b-0c52-66ba-d4934e546868/mzaf_1648549687321884445.plus.aac.p.m4a', 'https://music.apple.com/us/album/before-he-cheats/214695525?i=214696369&uo=4'),
  (gen_random_uuid(), 'Love Story', 'Taylor Swift', 'Love Story', 'Country', 2008, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c3/d0/1c/c3d01c88-73e7-187e-fd62-e1744de979a6/21UMGIM09915.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8b/4c/b3/8b4cb3a5-b1d1-c82c-e6ab-48cc3969d4ff/mzaf_858711921713575608.plus.aac.p.m4a', 'https://music.apple.com/us/album/love-story-taylors-version/1552791073?i=1552791427&uo=4'),
  (gen_random_uuid(), 'You Belong With Me', 'Taylor Swift', 'You Belong With Me', 'Country', 2008, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c3/d0/1c/c3d01c88-73e7-187e-fd62-e1744de979a6/21UMGIM09915.rgb.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ec/84/f2/ec84f262-1498-583f-dd5b-cd1a78587bce/mzaf_8651470950553551918.plus.aac.p.m4a', 'https://music.apple.com/us/album/you-belong-with-me-taylors-version/1552791073?i=1552791558&uo=4'),
  (gen_random_uuid(), 'Chandelier', 'Sia', 'Chandelier', 'Pop', 2014, 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/00/bf/72/00bf72a2-3e50-e5e7-ae78-dc35bbf9bcda/886444578219.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f0/de/66/f0de661c-299a-b7ae-80d9-4f35f79875b1/mzaf_10598240417031133475.plus.aac.p.m4a', 'https://music.apple.com/us/album/chandelier/882945378?i=882945383&uo=4'),
  (gen_random_uuid(), 'Titanium', 'David Guetta', 'Titanium', 'Electronic', 2011, 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/77/6f/57/776f57e2-017d-ed40-8f0f-1547beb65517/190296501425.jpg/600x600bb.jpg', 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/d7/31/16/d7311629-4945-2c68-38ef-2ea808582d0e/mzaf_16661300875206508900.plus.aac.p.m4a', 'https://music.apple.com/us/album/titanium-feat-sia-david-guetta-morten-future-rave-remix/1581632006?i=1581632203&uo=4'),
  (gen_random_uuid(), 'Harder, Better, Faster, Stronger', 'Daft Punk', 'Harder, Better, Faster, Stronger', 'Electronic', 2001, NULL, NULL, NULL);


-- Daily puzzle INSERT (80 days from 2026-10-12 to 2026-12-30)
INSERT INTO daily_puzzle (id, play_date, song_id) VALUES
  -- Wonderwall (Oasis)
  (gen_random_uuid(), '2026-10-12', (SELECT id FROM songs WHERE title = 'Wonderwall' AND artist = 'Oasis' LIMIT 1)),
  -- Champagne Supernova (Oasis)
  (gen_random_uuid(), '2026-10-13', (SELECT id FROM songs WHERE title = 'Champagne Supernova' AND artist = 'Oasis' LIMIT 1)),
  -- Yellow (Coldplay)
  (gen_random_uuid(), '2026-10-14', (SELECT id FROM songs WHERE title = 'Yellow' AND artist = 'Coldplay' LIMIT 1)),
  -- The Scientist (Coldplay)
  (gen_random_uuid(), '2026-10-15', (SELECT id FROM songs WHERE title = 'The Scientist' AND artist = 'Coldplay' LIMIT 1)),
  -- Fix You (Coldplay)
  (gen_random_uuid(), '2026-10-16', (SELECT id FROM songs WHERE title = 'Fix You' AND artist = 'Coldplay' LIMIT 1)),
  -- Viva la Vida (Coldplay)
  (gen_random_uuid(), '2026-10-17', (SELECT id FROM songs WHERE title = 'Viva la Vida' AND artist = 'Coldplay' LIMIT 1)),
  -- Every Breath You Take (The Police)
  (gen_random_uuid(), '2026-10-18', (SELECT id FROM songs WHERE title = 'Every Breath You Take' AND artist = 'The Police' LIMIT 1)),
  -- Roxanne (The Police)
  (gen_random_uuid(), '2026-10-19', (SELECT id FROM songs WHERE title = 'Roxanne' AND artist = 'The Police' LIMIT 1)),
  -- Message in a Bottle (The Police)
  (gen_random_uuid(), '2026-10-20', (SELECT id FROM songs WHERE title = 'Message in a Bottle' AND artist = 'The Police' LIMIT 1)),
  -- Should I Stay or Should I Go (The Clash)
  (gen_random_uuid(), '2026-10-21', (SELECT id FROM songs WHERE title = 'Should I Stay or Should I Go' AND artist = 'The Clash' LIMIT 1)),
  -- London Calling (The Clash)
  (gen_random_uuid(), '2026-10-22', (SELECT id FROM songs WHERE title = 'London Calling' AND artist = 'The Clash' LIMIT 1)),
  -- Come as You Are (Nirvana)
  (gen_random_uuid(), '2026-10-23', (SELECT id FROM songs WHERE title = 'Come as You Are' AND artist = 'Nirvana' LIMIT 1)),
  -- In Bloom (Nirvana)
  (gen_random_uuid(), '2026-10-24', (SELECT id FROM songs WHERE title = 'In Bloom' AND artist = 'Nirvana' LIMIT 1)),
  -- Jeremy (Pearl Jam)
  (gen_random_uuid(), '2026-10-25', (SELECT id FROM songs WHERE title = 'Jeremy' AND artist = 'Pearl Jam' LIMIT 1)),
  -- Alive (Pearl Jam)
  (gen_random_uuid(), '2026-10-26', (SELECT id FROM songs WHERE title = 'Alive' AND artist = 'Pearl Jam' LIMIT 1)),
  -- Killing in the Name (Rage Against the Machine)
  (gen_random_uuid(), '2026-10-27', (SELECT id FROM songs WHERE title = 'Killing in the Name' AND artist = 'Rage Against the Machine' LIMIT 1)),
  -- Bulls on Parade (Rage Against the Machine)
  (gen_random_uuid(), '2026-10-28', (SELECT id FROM songs WHERE title = 'Bulls on Parade' AND artist = 'Rage Against the Machine' LIMIT 1)),
  -- Like a Stone (Audioslave)
  (gen_random_uuid(), '2026-10-29', (SELECT id FROM songs WHERE title = 'Like a Stone' AND artist = 'Audioslave' LIMIT 1)),
  -- Piano Man (Billy Joel)
  (gen_random_uuid(), '2026-10-30', (SELECT id FROM songs WHERE title = 'Piano Man' AND artist = 'Billy Joel' LIMIT 1)),
  -- Livin' on a Prayer (Bon Jovi)
  (gen_random_uuid(), '2026-10-31', (SELECT id FROM songs WHERE title = 'Livin'' on a Prayer' AND artist = 'Bon Jovi' LIMIT 1)),
  -- You Give Love a Bad Name (Bon Jovi)
  (gen_random_uuid(), '2026-11-01', (SELECT id FROM songs WHERE title = 'You Give Love a Bad Name' AND artist = 'Bon Jovi' LIMIT 1)),
  -- Eye of the Tiger (Survivor)
  (gen_random_uuid(), '2026-11-02', (SELECT id FROM songs WHERE title = 'Eye of the Tiger' AND artist = 'Survivor' LIMIT 1)),
  -- Take On Me (A-ha)
  (gen_random_uuid(), '2026-11-03', (SELECT id FROM songs WHERE title = 'Take On Me' AND artist = 'A-ha' LIMIT 1)),
  -- Tainted Love (Soft Cell)
  (gen_random_uuid(), '2026-11-04', (SELECT id FROM songs WHERE title = 'Tainted Love' AND artist = 'Soft Cell' LIMIT 1)),
  -- Don't You (Forget About Me) (Simple Minds)
  (gen_random_uuid(), '2026-11-05', (SELECT id FROM songs WHERE title = 'Don''t You (Forget About Me)' AND artist = 'Simple Minds' LIMIT 1)),
  -- Girls Just Want to Have Fun (Cyndi Lauper)
  (gen_random_uuid(), '2026-11-06', (SELECT id FROM songs WHERE title = 'Girls Just Want to Have Fun' AND artist = 'Cyndi Lauper' LIMIT 1)),
  -- Total Eclipse of the Heart (Bonnie Tyler)
  (gen_random_uuid(), '2026-11-07', (SELECT id FROM songs WHERE title = 'Total Eclipse of the Heart' AND artist = 'Bonnie Tyler' LIMIT 1)),
  -- All Along the Watchtower (Jimi Hendrix)
  (gen_random_uuid(), '2026-11-08', (SELECT id FROM songs WHERE title = 'All Along the Watchtower' AND artist = 'Jimi Hendrix' LIMIT 1)),
  -- Purple Haze (Jimi Hendrix)
  (gen_random_uuid(), '2026-11-09', (SELECT id FROM songs WHERE title = 'Purple Haze' AND artist = 'Jimi Hendrix' LIMIT 1)),
  -- Light My Fire (The Doors)
  (gen_random_uuid(), '2026-11-10', (SELECT id FROM songs WHERE title = 'Light My Fire' AND artist = 'The Doors' LIMIT 1)),
  -- Brown Eyed Girl (Van Morrison)
  (gen_random_uuid(), '2026-11-11', (SELECT id FROM songs WHERE title = 'Brown Eyed Girl' AND artist = 'Van Morrison' LIMIT 1)),
  -- Sympathy for the Devil (The Rolling Stones)
  (gen_random_uuid(), '2026-11-12', (SELECT id FROM songs WHERE title = 'Sympathy for the Devil' AND artist = 'The Rolling Stones' LIMIT 1)),
  -- Gimme Shelter (The Rolling Stones)
  (gen_random_uuid(), '2026-11-13', (SELECT id FROM songs WHERE title = 'Gimme Shelter' AND artist = 'The Rolling Stones' LIMIT 1)),
  -- Don't Stop Me Now (Queen)
  (gen_random_uuid(), '2026-11-14', (SELECT id FROM songs WHERE title = 'Don''t Stop Me Now' AND artist = 'Queen' LIMIT 1)),
  -- We Are the Champions (Queen)
  (gen_random_uuid(), '2026-11-15', (SELECT id FROM songs WHERE title = 'We Are the Champions' AND artist = 'Queen' LIMIT 1)),
  -- Under Pressure (Queen)
  (gen_random_uuid(), '2026-11-16', (SELECT id FROM songs WHERE title = 'Under Pressure' AND artist = 'Queen' LIMIT 1)),
  -- Life on Mars? (David Bowie)
  (gen_random_uuid(), '2026-11-17', (SELECT id FROM songs WHERE title = 'Life on Mars?' AND artist = 'David Bowie' LIMIT 1)),
  -- Ziggy Stardust (David Bowie)
  (gen_random_uuid(), '2026-11-18', (SELECT id FROM songs WHERE title = 'Ziggy Stardust' AND artist = 'David Bowie' LIMIT 1)),
  -- Stan (Eminem)
  (gen_random_uuid(), '2026-11-19', (SELECT id FROM songs WHERE title = 'Stan' AND artist = 'Eminem' LIMIT 1)),
  -- Without Me (Eminem)
  (gen_random_uuid(), '2026-11-20', (SELECT id FROM songs WHERE title = 'Without Me' AND artist = 'Eminem' LIMIT 1)),
  -- 99 Problems (Jay-Z)
  (gen_random_uuid(), '2026-11-21', (SELECT id FROM songs WHERE title = '99 Problems' AND artist = 'Jay-Z' LIMIT 1)),
  -- Empire State of Mind (Jay-Z)
  (gen_random_uuid(), '2026-11-22', (SELECT id FROM songs WHERE title = 'Empire State of Mind' AND artist = 'Jay-Z' LIMIT 1)),
  -- Hotline Bling (Drake)
  (gen_random_uuid(), '2026-11-23', (SELECT id FROM songs WHERE title = 'Hotline Bling' AND artist = 'Drake' LIMIT 1)),
  -- One Dance (Drake)
  (gen_random_uuid(), '2026-11-24', (SELECT id FROM songs WHERE title = 'One Dance' AND artist = 'Drake' LIMIT 1)),
  -- Umbrella (Rihanna)
  (gen_random_uuid(), '2026-11-25', (SELECT id FROM songs WHERE title = 'Umbrella' AND artist = 'Rihanna' LIMIT 1)),
  -- We Found Love (Rihanna)
  (gen_random_uuid(), '2026-11-26', (SELECT id FROM songs WHERE title = 'We Found Love' AND artist = 'Rihanna' LIMIT 1)),
  -- Diamonds (Rihanna)
  (gen_random_uuid(), '2026-11-27', (SELECT id FROM songs WHERE title = 'Diamonds' AND artist = 'Rihanna' LIMIT 1)),
  -- Work (Rihanna)
  (gen_random_uuid(), '2026-11-28', (SELECT id FROM songs WHERE title = 'Work' AND artist = 'Rihanna' LIMIT 1)),
  -- ...Baby One More Time (Britney Spears)
  (gen_random_uuid(), '2026-11-29', (SELECT id FROM songs WHERE title = '...Baby One More Time' AND artist = 'Britney Spears' LIMIT 1)),
  -- Toxic (Britney Spears)
  (gen_random_uuid(), '2026-11-30', (SELECT id FROM songs WHERE title = 'Toxic' AND artist = 'Britney Spears' LIMIT 1)),
  -- Wrecking Ball (Miley Cyrus)
  (gen_random_uuid(), '2026-12-01', (SELECT id FROM songs WHERE title = 'Wrecking Ball' AND artist = 'Miley Cyrus' LIMIT 1)),
  -- Roar (Katy Perry)
  (gen_random_uuid(), '2026-12-02', (SELECT id FROM songs WHERE title = 'Roar' AND artist = 'Katy Perry' LIMIT 1)),
  -- Firework (Katy Perry)
  (gen_random_uuid(), '2026-12-03', (SELECT id FROM songs WHERE title = 'Firework' AND artist = 'Katy Perry' LIMIT 1)),
  -- Hello (Adele)
  (gen_random_uuid(), '2026-12-04', (SELECT id FROM songs WHERE title = 'Hello' AND artist = 'Adele' LIMIT 1)),
  -- Set Fire to the Rain (Adele)
  (gen_random_uuid(), '2026-12-05', (SELECT id FROM songs WHERE title = 'Set Fire to the Rain' AND artist = 'Adele' LIMIT 1)),
  -- Skyfall (Adele)
  (gen_random_uuid(), '2026-12-06', (SELECT id FROM songs WHERE title = 'Skyfall' AND artist = 'Adele' LIMIT 1)),
  -- Single Ladies (Put a Ring on It) (Beyonce)
  (gen_random_uuid(), '2026-12-07', (SELECT id FROM songs WHERE title = 'Single Ladies (Put a Ring on It)' AND artist = 'Beyonce' LIMIT 1)),
  -- Halo (Beyonce)
  (gen_random_uuid(), '2026-12-08', (SELECT id FROM songs WHERE title = 'Halo' AND artist = 'Beyonce' LIMIT 1)),
  -- Irreplaceable (Beyonce)
  (gen_random_uuid(), '2026-12-09', (SELECT id FROM songs WHERE title = 'Irreplaceable' AND artist = 'Beyonce' LIMIT 1)),
  -- Perfect (Ed Sheeran)
  (gen_random_uuid(), '2026-12-10', (SELECT id FROM songs WHERE title = 'Perfect' AND artist = 'Ed Sheeran' LIMIT 1)),
  -- Thinking Out Loud (Ed Sheeran)
  (gen_random_uuid(), '2026-12-11', (SELECT id FROM songs WHERE title = 'Thinking Out Loud' AND artist = 'Ed Sheeran' LIMIT 1)),
  -- Love Yourself (Justin Bieber)
  (gen_random_uuid(), '2026-12-12', (SELECT id FROM songs WHERE title = 'Love Yourself' AND artist = 'Justin Bieber' LIMIT 1)),
  -- With or Without You (U2)
  (gen_random_uuid(), '2026-12-13', (SELECT id FROM songs WHERE title = 'With or Without You' AND artist = 'U2' LIMIT 1)),
  -- One (U2)
  (gen_random_uuid(), '2026-12-14', (SELECT id FROM songs WHERE title = 'One' AND artist = 'U2' LIMIT 1)),
  -- Where the Streets Have No Name (U2)
  (gen_random_uuid(), '2026-12-15', (SELECT id FROM songs WHERE title = 'Where the Streets Have No Name' AND artist = 'U2' LIMIT 1)),
  -- Dancing Queen (ABBA)
  (gen_random_uuid(), '2026-12-16', (SELECT id FROM songs WHERE title = 'Dancing Queen' AND artist = 'ABBA' LIMIT 1)),
  -- Waterloo (ABBA)
  (gen_random_uuid(), '2026-12-17', (SELECT id FROM songs WHERE title = 'Waterloo' AND artist = 'ABBA' LIMIT 1)),
  -- Mamma Mia (ABBA)
  (gen_random_uuid(), '2026-12-18', (SELECT id FROM songs WHERE title = 'Mamma Mia' AND artist = 'ABBA' LIMIT 1)),
  -- Let's Stay Together (Al Green)
  (gen_random_uuid(), '2026-12-19', (SELECT id FROM songs WHERE title = 'Let''s Stay Together' AND artist = 'Al Green' LIMIT 1)),
  -- Ain't No Mountain High Enough (Marvin Gaye)
  (gen_random_uuid(), '2026-12-20', (SELECT id FROM songs WHERE title = 'Ain''t No Mountain High Enough' AND artist = 'Marvin Gaye' LIMIT 1)),
  -- What's Going On (Marvin Gaye)
  (gen_random_uuid(), '2026-12-21', (SELECT id FROM songs WHERE title = 'What''s Going On' AND artist = 'Marvin Gaye' LIMIT 1)),
  -- I Heard It Through the Grapevine (Marvin Gaye)
  (gen_random_uuid(), '2026-12-22', (SELECT id FROM songs WHERE title = 'I Heard It Through the Grapevine' AND artist = 'Marvin Gaye' LIMIT 1)),
  -- Tennessee Whiskey (Chris Stapleton)
  (gen_random_uuid(), '2026-12-23', (SELECT id FROM songs WHERE title = 'Tennessee Whiskey' AND artist = 'Chris Stapleton' LIMIT 1)),
  -- Friends in Low Places (Garth Brooks)
  (gen_random_uuid(), '2026-12-24', (SELECT id FROM songs WHERE title = 'Friends in Low Places' AND artist = 'Garth Brooks' LIMIT 1)),
  -- Before He Cheats (Carrie Underwood)
  (gen_random_uuid(), '2026-12-25', (SELECT id FROM songs WHERE title = 'Before He Cheats' AND artist = 'Carrie Underwood' LIMIT 1)),
  -- Love Story (Taylor Swift)
  (gen_random_uuid(), '2026-12-26', (SELECT id FROM songs WHERE title = 'Love Story' AND artist = 'Taylor Swift' LIMIT 1)),
  -- You Belong With Me (Taylor Swift)
  (gen_random_uuid(), '2026-12-27', (SELECT id FROM songs WHERE title = 'You Belong With Me' AND artist = 'Taylor Swift' LIMIT 1)),
  -- Chandelier (Sia)
  (gen_random_uuid(), '2026-12-28', (SELECT id FROM songs WHERE title = 'Chandelier' AND artist = 'Sia' LIMIT 1)),
  -- Titanium (David Guetta)
  (gen_random_uuid(), '2026-12-29', (SELECT id FROM songs WHERE title = 'Titanium' AND artist = 'David Guetta' LIMIT 1)),
  -- Harder, Better, Faster, Stronger (Daft Punk)
  (gen_random_uuid(), '2026-12-30', (SELECT id FROM songs WHERE title = 'Harder, Better, Faster, Stronger' AND artist = 'Daft Punk' LIMIT 1));
