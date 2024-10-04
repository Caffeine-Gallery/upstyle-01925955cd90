import Func "mo:base/Func";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Text "mo:base/Text";

actor FileUploader {
  // Define a type for our file entries
  type FileEntry = {
    name: Text;
    content: [Nat8];
    contentType: Text;
  };

  // Use a stable variable to store our files
  stable var fileEntries : [(Text, FileEntry)] = [];

  // Create a HashMap to store our files
  var fileStorage = HashMap.fromIter<Text, FileEntry>(fileEntries.vals(), 10, Text.equal, Text.hash);

  // Function to upload a file
  public func uploadFile(name: Text, content: [Nat8], contentType: Text) : async Text {
    let newFile : FileEntry = {
      name = name;
      content = content;
      contentType = contentType;
    };
    fileStorage.put(name, newFile);
    Debug.print("File uploaded: " # name);
    return "File uploaded successfully";
  };

  // Function to get all file names
  public query func getFileNames() : async [Text] {
    return Iter.toArray(fileStorage.keys());
  };

  // Function to get a specific file
  public query func getFile(name: Text) : async ?FileEntry {
    return fileStorage.get(name);
  };

  // Function to delete a file
  public func deleteFile(name: Text) : async Text {
    fileStorage.delete(name);
    return "File deleted successfully";
  };

  // Pre-upgrade hook to save the state
  system func preupgrade() {
    fileEntries := Iter.toArray(fileStorage.entries());
  };

  // Post-upgrade hook to restore the state
  system func postupgrade() {
    fileStorage := HashMap.fromIter<Text, FileEntry>(fileEntries.vals(), 10, Text.equal, Text.hash);
  };
}
