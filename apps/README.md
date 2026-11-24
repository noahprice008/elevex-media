# ELEVEX Apps TikTok queue

`queue.json` lists the clips for @elevexapps, in posting order. The n8n workflow "ELEVEX Apps: auto-post" posts one clip at each slot (18:40 and 22:40 Israel time).

To add a clip: upload `ID.mp4` and `ID.jpg` (cover) into this folder, then set `"ready": true` for that clip in `queue.json`. A clip that is not ready is skipped, and the queue waits on it.
