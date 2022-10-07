import "./ServerAudioLoader";
import "./ServerTextureLoader";

/**
 * FIXME: Dirty hack to temporarily allow running stuff that
 * relies on window in the server
 */
(global as any).window = { innerWidth: 1000, innerHeight: 1000 };
