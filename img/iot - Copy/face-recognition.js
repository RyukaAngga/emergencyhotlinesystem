/**
 * Face Recognition Utility
 * Fungsi-fungsi untuk matching dan comparing face descriptors
 */

/**
 * Hitung cosine similarity antara dua face descriptors
 * @param {Float32Array|Array} descriptor1 - Face descriptor pertama (128 angka)
 * @param {Float32Array|Array} descriptor2 - Face descriptor kedua (128 angka)
 * @returns {number} Similarity score (0-1), semakin tinggi semakin mirip
 */
function cosineSimilarity(descriptor1, descriptor2) {
    if (!descriptor1 || !descriptor2) return 0;
    if (descriptor1.length !== descriptor2.length) return 0;

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < descriptor1.length; i++) {
        dotProduct += descriptor1[i] * descriptor2[i];
        norm1 += descriptor1[i] * descriptor1[i];
        norm2 += descriptor2[i] * descriptor2[i];
    }

    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);

    if (norm1 === 0 || norm2 === 0) return 0;

    return dotProduct / (norm1 * norm2);
}

/**
 * Hitung euclidean distance antara dua face descriptors
 * @param {Float32Array|Array} descriptor1 - Face descriptor pertama
 * @param {Float32Array|Array} descriptor2 - Face descriptor kedua
 * @returns {number} Distance score (semakin kecil semakin mirip)
 */
function euclideanDistance(descriptor1, descriptor2) {
    if (!descriptor1 || !descriptor2) return Infinity;
    if (descriptor1.length !== descriptor2.length) return Infinity;

    let sum = 0;
    for (let i = 0; i < descriptor1.length; i++) {
        const diff = descriptor1[i] - descriptor2[i];
        sum += diff * diff;
    }

    return Math.sqrt(sum);
}

/**
 * Cari wajah yang paling mirip dari array registered faces
 * @param {Float32Array|Array} queryDescriptor - Face descriptor yang dicari
 * @param {Array} registeredFaces - Array of {id, name, descriptor, ...}
 * @param {number} threshold - Minimum similarity threshold (default: 0.6)
 * @returns {Object|null} {face, similarity} atau null jika tidak ada yang match
 */
function findBestMatch(queryDescriptor, registeredFaces, threshold = 0.6) {
    if (!queryDescriptor || !registeredFaces || registeredFaces.length === 0) {
        return null;
    }

    let bestMatch = null;
    let bestSimilarity = 0;

    for (const face of registeredFaces) {
        if (!face.face_descriptor || !face.is_active) continue;

        // Convert descriptor ke array jika masih string/JSON
        let descriptor = face.face_descriptor;
        if (typeof descriptor === 'string') {
            try {
                descriptor = JSON.parse(descriptor);
            } catch (e) {
                console.warn('Invalid descriptor format:', face.id);
                continue;
            }
        }

        // Hitung similarity
        const similarity = cosineSimilarity(queryDescriptor, descriptor);

        if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestMatch = {
                face: face,
                similarity: similarity
            };
        }
    }

    // Return match jika similarity >= threshold
    if (bestMatch && bestMatch.similarity >= threshold) {
        return bestMatch;
    }

    return null;
}

/**
 * Ekstrak face descriptor dari hasil deteksi face-api.js
 * @param {Object} detection - Hasil dari faceapi.detectSingleFace()
 * @param {HTMLVideoElement|HTMLImageElement} input - Video atau image element
 * @returns {Promise<Float32Array|null>} Face descriptor atau null jika gagal
 */
async function extractFaceDescriptor(detection, input) {
    try {
        if (!detection) return null;

        // Pastikan face recognition model sudah dimuat
        if (!faceapi.nets.faceRecognitionNet.isLoaded) {
            console.warn('Face recognition model belum dimuat');
            return null;
        }

        // Ekstrak descriptor
        const descriptor = await faceapi
            .computeFaceDescriptor(input, detection);

        return descriptor;
    } catch (error) {
        console.error('Error extracting face descriptor:', error);
        return null;
    }
}

/**
 * Simpan face descriptor ke format yang bisa disimpan di database
 * @param {Float32Array|Array} descriptor - Face descriptor
 * @returns {Array} Array biasa yang bisa di-serialize ke JSON
 */
function serializeDescriptor(descriptor) {
    if (!descriptor) return null;
    
    // Convert Float32Array ke Array biasa
    if (descriptor instanceof Float32Array) {
        return Array.from(descriptor);
    }
    
    return descriptor;
}

/**
 * Load face descriptor dari database format
 * @param {string|Array} descriptorData - Data dari database
 * @returns {Array|null} Face descriptor array atau null
 */
function deserializeDescriptor(descriptorData) {
    if (!descriptorData) return null;
    
    if (typeof descriptorData === 'string') {
        try {
            return JSON.parse(descriptorData);
        } catch (e) {
            console.error('Error parsing descriptor:', e);
            return null;
        }
    }
    
    return descriptorData;
}

// Export functions untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        cosineSimilarity,
        euclideanDistance,
        findBestMatch,
        extractFaceDescriptor,
        serializeDescriptor,
        deserializeDescriptor
    };
}



