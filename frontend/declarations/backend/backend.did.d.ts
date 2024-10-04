import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface FileEntry {
  'content' : Uint8Array | number[],
  'contentType' : string,
  'name' : string,
}
export interface _SERVICE {
  'deleteFile' : ActorMethod<[string], string>,
  'getFile' : ActorMethod<[string], [] | [FileEntry]>,
  'getFileNames' : ActorMethod<[], Array<string>>,
  'uploadFile' : ActorMethod<[string, Uint8Array | number[], string], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
