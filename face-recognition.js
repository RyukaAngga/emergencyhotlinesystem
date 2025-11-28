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
function findBestMatch(queryDescriptor, registeredFaces, threshold = 0.6) {
    if (!queryDescriptor || !registeredFaces || registeredFaces.length === 0) {
        return null;
    }
    let bestMatch = null;
    let bestSimilarity = 0;
    for (const face of registeredFaces) {
        if (!face.face_descriptor || !face.is_active) continue;
        let descriptor = face.face_descriptor;
        if (typeof descriptor === 'string') {
            try {
                descriptor = JSON.parse(descriptor);
            } catch (e) {
                console.warn('Invalid descriptor format:', face.id);
                continue;
            }
        }
        const similarity = cosineSimilarity(queryDescriptor, descriptor);
        if (similarity > bestSimilarity) {
            bestSimilarity = similarity;
            bestMatch = {
                face: face,
                similarity: similarity
            };
        }
    }
    if (bestMatch) {
        console.log(' Best match found:', {
            name: bestMatch.face.name,
            similarity: bestMatch.similarity,
            threshold: threshold,
            passed: bestMatch.similarity >= threshold
        });
        if (bestMatch.similarity >= threshold) {
            return bestMatch;
        } else {
            console.log(' Match rejected - similarity too low');
        }
    } else {
        console.log(' No match found in registered faces');
    }
    return null;
}
async function extractFaceDescriptor(detection, input) {
    try {
        if (!detection) return null;
        if (!faceapi.nets.faceRecognitionNet.isLoaded) {
            console.warn('Face recognition model belum dimuat');
            return null;
        }
        const descriptor = await faceapi
            .computeFaceDescriptor(input, detection);
        return descriptor;
    } catch (error) {
        console.error('Error extracting face descriptor:', error);
        return null;
    }
}
function serializeDescriptor(descriptor) {
    if (!descriptor) return null;
    if (descriptor instanceof Float32Array) {
        return Array.from(descriptor);
    }
    return descriptor;
}
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