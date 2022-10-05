import "./ServerAudioLoader";
import "./ServerBackgroundRenderer";
import "./ServerEntityRenderer";
import "./ServerTextureLoader";
import "./ServerTimer";
import "./UserInput";

/**
 * FIXME: Dirty hack to temporarily allow running stuff that
 * relies on window in the server
 */
(global as any).window = { innerWidth: 1000, innerHeight: 1000 };
