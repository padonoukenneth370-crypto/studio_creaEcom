const { db } = require('../firebaseAdmin');
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  try {
    const { request_id, state, video_url } = req.body; 
    if (state === 'completed' && video_url) {
      await db.collection('generations').doc(request_id).update({
        status: 'completed',
        videoUrl: video_url
      });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
