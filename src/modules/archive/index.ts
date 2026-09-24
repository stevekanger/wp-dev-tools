import { archiveArgsConfig, showCmdHelp } from '@/args';
import { DevToolsJson } from '@/types';
import { argOrPrompt } from '@/utils/argOrPrompt';
import ensureDir from '@/utils/ensureDir';
import getJsonFileContents from '@/utils/getJsonFileContents';
import normalizePath from '@/utils/normalizePath';
import { promptBoolean, promptDir, promptValues } from '@/utils/prompts';
import { isOneOf, isString } from '@/utils/typeChecks';
import UserError from '@/utils/UserError';
import { ZipArchive } from 'archiver';
import fs from 'fs';
import path from 'path';
import { parseArgs } from 'util';
import checkVersion from './checkVersion';
import { ArchiveType } from './types';

/**
 * Creates the archiver
 *
 * @param destPath The path the archive files will go in
 */
function createArchiver(destPath: string): ZipArchive {
  // create a file to stream archive data to.
  const stream = fs.createWriteStream(destPath);

  // create the archiver
  const archiver = new ZipArchive({
    zlib: { level: 9 }, // Sets the compression level.
  });

  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  stream.on('close', function() {
    console.log(`
===============
== Finished! ==
===============

Archiver wrote ${archiver.pointer()} bytes.
`);
  });

  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  stream.on('end', function() {
    console.log('Data has been drained');
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archiver.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });

  // good practice to catch this error explicitly
  archiver.on('error', function(err) {
    throw err;
  });

  // pipe archive data to the file
  archiver.pipe(stream);

  return archiver;
}

/**
 * Creates the package archive.
 *
 * Output will be placed in the outputDir defined in the config.js file.
 *
 * @since 0.1.0
 */
export default async function archive() {
  const args = parseArgs(archiveArgsConfig);

  if (args.values.help) {
    showCmdHelp(archiveArgsConfig);
    return;
  }

  const src = await argOrPrompt(
    normalizePath(args.values.src),
    promptDir('Source location.'),
    isString,
  );
  const dest = await argOrPrompt(
    normalizePath(args.values.dest),
    promptDir('Destination location.'),
    isString,
  );
  const type: ArchiveType = await argOrPrompt(
    args.values.type,
    promptValues('Archive type.', ['dist', 'dev'] as const),
    isOneOf('dist', 'dev'),
  );

  ensureDir(dest);

  const devToolsJson = getJsonFileContents<DevToolsJson>(
    path.join(src, 'dev-tools.json'),
  );

  if (!devToolsJson) {
    throw new UserError('Error getting dev-tools.json in cwd.');
  }

  const packageJson = getJsonFileContents<{ version: string; name: string }>(
    path.join(src, 'package.json'),
  );

  if (!packageJson) {
    throw new UserError('Error getting package.json in cwd.');
  }

  const {
    files: { dev: includedDev, dist: includedDist },
  } = devToolsJson;

  const version = packageJson.version;
  checkVersion(path.join(src, devToolsJson.main), version);

  const versionConfirmed = await promptBoolean(
    `Is the current stated verison "${version}" correct?"`,
  )();

  if (!versionConfirmed) {
    throw new UserError('Version not confirmed.');
  }

  const packageName = packageJson.name;
  const archiveName =
    type === 'dev'
      ? `${packageName}-dev.${version}.zip`
      : `${packageName}.${version}.zip`;

  const includedItems = type === 'dist' ? includedDist : includedDev;
  const destPath = path.join(dest, archiveName);
  const archiver = createArchiver(destPath);

  // create the package subdirectory
  archiver.directory(packageName, packageName);

  // add the files to the subdirectory
  fs.readdirSync(src).forEach((item) => {
    if (!includedItems.includes(item)) {
      return;
    }

    const inputItemPath = path.join(src, item);
    const outputItemPath = `${packageName}/${item}`;
    const stat = fs.statSync(inputItemPath);

    if (stat.isFile()) {
      archiver.file(inputItemPath, { name: outputItemPath });
    } else if (stat.isDirectory()) {
      archiver.directory(inputItemPath, outputItemPath);
    }
  });

  // finalize the archiver
  await archiver.finalize();
}
