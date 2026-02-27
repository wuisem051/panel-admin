// netlify/functions/deleteAuthUser.js
// Netlify Serverless Function para eliminar usuarios de Firebase Auth
// usando el Admin SDK (solo funciona en el servidor)

const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK (solo una vez)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            // La clave privada viene como string con \n literales desde Netlify env vars
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

exports.handler = async (event, context) => {
    // Solo permitir POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    // Verificar que la petición viene de un admin autenticado
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        // 1. Verificar el token del admin que hace la petición
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // 2. Obtener el documento del admin en Firestore para validar su rol
        const adminDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
        if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
            return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden: Admin role required' }) };
        }

        // 3. Parsear el body con el UID a eliminar
        const { uid } = JSON.parse(event.body);
        if (!uid) {
            return { statusCode: 400, body: JSON.stringify({ error: 'UID is required' }) };
        }

        // 4. Eliminar el usuario de Firebase Authentication
        await admin.auth().deleteUser(uid);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: `Usuario ${uid} eliminado de Firebase Auth` }),
        };
    } catch (error) {
        console.error('Error deleting user:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
