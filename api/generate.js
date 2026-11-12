const { db } = require('../firebaseAdmin');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  try {
    const { userId, prompt, model } = req.body;
    const cost = 1.12; // Coût simulé pour une vidéo
    
    // 1. Vérifier le solde
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists || userDoc.data().solde_usd < cost) {
      return res.status(400).json({ error: "Solde insuffisant" });
    }

    // 2. Déduire le coût
    await userRef.update({ solde_usd: userDoc.data().solde_usd - cost });

    // 3. Simuler l'appel à Higgsfield (à remplacer par le vrai code AntiGravity plus tard)
    const mockRequestId = "req_" + Math.random().toString(36).substr(2, 9);
    await db.collection('generations').doc(mockRequestId).set({
      userId, prompt, model, cost, status: 'pending'
    });

    return res.status(200).json({ success: true, request_id: mockRequestId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
