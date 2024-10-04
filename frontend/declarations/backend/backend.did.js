export const idlFactory = ({ IDL }) => {
  const FileEntry = IDL.Record({
    'content' : IDL.Vec(IDL.Nat8),
    'contentType' : IDL.Text,
    'name' : IDL.Text,
  });
  return IDL.Service({
    'deleteFile' : IDL.Func([IDL.Text], [IDL.Text], []),
    'getFile' : IDL.Func([IDL.Text], [IDL.Opt(FileEntry)], ['query']),
    'getFileContent' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        ['query'],
      ),
    'getFileNames' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'uploadFile' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Nat8), IDL.Text],
        [IDL.Text],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
