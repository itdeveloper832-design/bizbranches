const INDEXNOW_API_KEY = '2f7faa808792498083543bb6cffb4123';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pakbizbranches.online';
const DOMAIN = new URL(SITE_URL).hostname;
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_API_KEY}.txt`;

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

/**
 * Submits URLs to the IndexNow API using standard fetch.
 * @param urls Array of URLs to submit.
 * @param retry Whether to retry once on failure.
 */
export async function submitToIndexNow(urls: string[], retry = true): Promise<{ success: boolean; message: string }> {
  if (!urls || urls.length === 0) {
    return { success: true, message: 'No URLs to submit.' };
  }

  // Remove duplicates and filter out empty strings
  const uniqueUrls = [...new Set(urls.filter(url => url && url.startsWith('http')))];
  
  if (uniqueUrls.length === 0) {
    return { success: true, message: 'No valid URLs to submit.' };
  }

  // IndexNow allows up to 10,000 URLs per request, but we'll batch by 100 as requested.
  const chunks = [];
  for (let i = 0; i < uniqueUrls.length; i += 100) {
    chunks.push(uniqueUrls.slice(i, i + 100));
  }

  const results = [];

  for (const chunk of chunks) {
    const payload: IndexNowPayload = {
      host: DOMAIN,
      key: INDEXNOW_API_KEY,
      keyLocation: KEY_LOCATION,
      urlList: chunk,
    };

    try {
      const response = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status === 202) {
        console.log(`[IndexNow] Successfully submitted ${chunk.length} URLs.`);
        results.push({ success: true, chunk: chunk.length });
      } else {
        const errorText = await response.text();
        throw new Error(`Status ${response.status}: ${errorText}`);
      }
    } catch (error: any) {
      console.error(`[IndexNow] Failed to submit chunk:`, error.message);
      
      if (retry) {
        console.log(`[IndexNow] Retrying chunk...`);
        // Retry once for this specific chunk
        const retryResult = await submitToIndexNow(chunk, false);
        results.push(retryResult);
      } else {
        results.push({ success: false, error: error.message });
      }
    }
  }

  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    return { 
      success: false, 
      message: `Failed to submit some chunks. ${failed.map((f: any) => f.error || f.message || 'Unknown error').join(', ')}` 
    };
  }

  return { success: true, message: `Submitted ${uniqueUrls.length} URLs successfully.` };
}
