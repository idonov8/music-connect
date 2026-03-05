import axios from 'axios';
import { SONGLINK_API } from '../config';

export async function getLinks(songUrl) {
  try {
    const response = await axios.get(SONGLINK_API, {
      params: { url: songUrl },
      timeout: 15000,
    });

    const { linksByPlatform, entitiesByUniqueId, pageUrl, entityUniqueId } = response.data;

    const primaryEntity = entityUniqueId ? entitiesByUniqueId[entityUniqueId] : null;

    const result = {
      pageUrl,
      title: primaryEntity?.title || null,
      artistName: primaryEntity?.artistName || null,
      thumbnailUrl: primaryEntity?.thumbnailUrl || null,
      platforms: {},
    };

    if (linksByPlatform) {
      for (const [platform, data] of Object.entries(linksByPlatform)) {
        result.platforms[platform] = {
          url: data.url,
        };
      }
    }

    return result;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error('No matching song found for this link.');
      }
      if (status === 429) {
        throw new Error('Too many requests. Please try again in a minute.');
      }
      throw new Error('Failed to look up song. Please try again.');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    if (error.message?.includes('Network Error')) {
      throw new Error('Network error. Check your connection.');
    }
    throw new Error('An unexpected error occurred.');
  }
}
