import UserError from './UserError';

interface WpData {
  recommendedWpVersion: string;
  recommendedPhpVersion: string;
}

/**
 * Gets the latest wordpress version from api.
 */
export default async function getWpData(): Promise<WpData> {
  try {
    const wpVersionRes = await fetch(
      'https://api.wordpress.org/core/version-check/1.7/',
    );

    if (wpVersionRes.status !== 200) {
      throw new UserError(
        'Failed fetching wordpress version data. Please try again shortly.',
      );
    }

    const wpVersionData = await wpVersionRes.json();
    const recommendedWpVersion = wpVersionData.offers[0].version;
    const minPhp = wpVersionData.offers[0].php_version;

    const phpVersionRes = await fetch(
      `https://api.wordpress.org/core/serve-happy/1.0/?php_version=${minPhp}`,
    );

    if (phpVersionRes.status !== 200) {
      throw new UserError(
        'Failed fetching wordpress version and php data which can happen occasionally. Please try again shortly.',
      );
    }

    const { recommended_version: recommendedPhpVersion } =
      await phpVersionRes.json();

    return {
      recommendedWpVersion,
      recommendedPhpVersion,
    };
  } catch (err) {
    throw err;
  }
}
