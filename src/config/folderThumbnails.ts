// Folder thumbnail configuration
// Add your folder thumbnails here using the folder name or ID as key
// You can use local paths (from public folder) or external URLs

export interface FolderThumbnail {
  image: string; // URL or path to image
  alt?: string; // Alt text for accessibility
}

export const folderThumbnails: Record<string, FolderThumbnail> = {
  // Template Gallery folders
  "Emails": {
    image: "/images/email.png",
    alt: "Images folder thumbnail"
  },

  "Images": {
    image: "/images/Images.jpg",
    alt: "Images folder thumbnail"
  },

  "Podcasts": {
    image: "/images/Podcasts.jpg", 
    alt: "Podcasts folder thumbnail"
  },
  "Videos": {
    image: "/images/Videos.jpg",
    alt: "Videos folder thumbnail"
  },
  
  // Library tab folders (you can use the same images or add specific ones)
  "images": {
    image: "/images/Images.jpg",
    alt: "Images library folder"
  },
  "logos": {
    image: "/images/Images.jpg", // You can replace with a specific logo thumbnail
    alt: "Logos library folder"
  },
  "assets": {
    image: "/images/Images.jpg", // You can replace with a specific assets thumbnail
    alt: "Assets library folder"
  }
  // Add more folder thumbnails here as needed
  // "Folder Name": {
  //   image: "/images/folder-thumbnail.jpg",
  //   alt: "Folder description"
  // }
};

export const getFolderThumbnail = (folderName: string, folderId?: string): FolderThumbnail | null => {
  // Try to find by folder name first, then by ID
  return folderThumbnails[folderName] || 
         (folderId ? folderThumbnails[folderId] : null) || 
         null;
};