# ELEVEX Apps TikTok queue

`queue.json` lists the clips for @elevexapps, in posting order. The n8n workflow "ELEVEX Apps: auto-post" posts one clip at each slot (00:45, 11:00 and 18:00 Israel time, 3 a day).

To add a clip: upload `ID.mp4` and `ID.jpg` (cover) into this folder, then set `"ready": true` for that clip in `queue.json`. A clip that is not ready is skipped, and the queue waits on it.
