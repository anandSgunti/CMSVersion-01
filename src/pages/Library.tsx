import React, { useEffect, useMemo, useState } from "react";
import { Image, Zap, Package, Search, Grid, List, Download, X , Shield } from "lucide-react";
import { getFolderThumbnail } from "../config/folderThumbnails";

// Types
export type AssetType = "image" | "logo" | "asset";

export interface AssetFile {
  id: string;
  name: string;
  type: AssetType;
  url: string; // blob:, data:, or https:
  size: number;
  uploadedAt: string; // ISO string
  thumbnail?: string;
}

type ViewMode = "grid" | "list";

export function Library() {
  const [assets, setAssets] = useState<AssetFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<AssetType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewAsset, setPreviewAsset] = useState<AssetFile | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Demo data (replace with API data later)
  useEffect(() => {
    const demo: AssetFile[] = [
      { id: "img-1", name: "Email Template Copy", type: "image", url: "https://picsum.photos/seed/hero/1200/800", size: 245760, uploadedAt: "2025-09-08T10:30:00Z" },
      { id: "img-2", name: "Email", type: "image", url: "https://picsum.photos/seed/prod/1200/800", size: 189440, uploadedAt: "2025-09-03T14:20:00Z" },
      { id: "img-3", name: "One-Pager Template Copy", type: "image", url: "https://picsum.photos/seed/team/1200/800", size: 312320, uploadedAt: "2025-06-01T09:15:00Z" },
      { id: "logo-1", name: "Brand Wordmark", type: "logo", url: "https://picsum.photos/seed/logo1/800/400", size: 15360, uploadedAt: "2025-08-30T16:45:00Z" },
      { id: "logo-2", name: "App Icon", type: "logo", url: "https://picsum.photos/seed/logo2/600/600", size: 8192, uploadedAt: "2025-08-28T11:30:00Z" },
      { id: "asset-1", name: "presentation.pdf", type: "asset", url: "https://example.com/presentation.pdf", size: 2048000, uploadedAt: "2025-08-26T13:22:00Z" },
      { id: "asset-2", name: "project-files.zip", type: "asset", url: "https://example.com/project-files.zip", size: 5120000, uploadedAt: "2025-08-25T08:00:00Z" },
    ];
    setAssets(demo);
  }, []);

  const folderConfig: Record<AssetType, { icon: any; title: string; description: string }> = {
    image: { icon: Image, title: "images", description: "Photos, illustrations, and graphics" },
    logo: { icon: Zap, title: "logos", description: "Brand logos and icons" },
    asset: { icon: Package, title: "assets", description: "Documents, videos, and other files" },
  };

  // ---------------- Helpers ----------------
  const normalize = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

  const fileExt = (name: string) => {
    const i = name.lastIndexOf(".");
    return i >= 0 ? name.slice(i + 1) : "";
  };

  const matchAsset = (a: AssetFile, q: string) => {
    if (!q) return true;
    const qq = normalize(q.trim());
    const n = normalize(a.name);
    const ext = normalize(fileExt(a.name));
    return n.includes(qq) || (ext && ext.includes(qq));
  };

  const formatDateAgo = (iso: string) => {
    const ms = Date.now() - new Date(iso).getTime();
    const days = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
    if (days <= 0) return "today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const lastUpdatedFor = (t: AssetType) => {
    const list = assets.filter((a) => a.type === t);
    if (list.length === 0) return "—";
    const latest = list.reduce((acc, a) => (a.uploadedAt > acc.uploadedAt ? a : acc));
    return formatDateAgo(latest.uploadedAt);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  };

  const downloadAsset = async (asset: AssetFile) => {
    try {
      const res = await fetch(asset.url, { mode: "cors" });
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = asset.name || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      const a = document.createElement("a");
      a.href = asset.url;
      a.download = asset.name || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const ToggleButton: React.FC<{
    icon: React.ComponentType<any>;
    active: boolean;
    onClick: () => void;
    label: string;
  }> = ({ icon: Icon, active, onClick, label }) => (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`h-10 w-10 rounded-full border flex items-center justify-center transition ${
        active ? "bg-red-50 border-red-300 text-red-600" : "bg-white border-gray-200"
      }`}
      title={label}
    >
      <Icon size={18} />
      <span className="sr-only">{label}</span>
    </button>
  );

  // -------------- Search Memos --------------
  // Grouped results when on the FOLDERS screen and search has text
  const groupedResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const groups: Record<AssetType, AssetFile[]> = { image: [], logo: [], asset: [] };
    for (const a of assets) if (matchAsset(a, searchTerm)) groups[a.type].push(a);
    (Object.keys(groups) as AssetType[]).forEach((t) =>
      groups[t].sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
    );
    return groups;
  }, [assets, searchTerm]);

  // Filtered assets for the ASSET screen
  const filteredAssets = useMemo(() => {
    if (!selectedFolder) return [];
    const within = assets.filter((a) => a.type === selectedFolder);
    return within
      .filter((a) => matchAsset(a, searchTerm))
      .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
  }, [assets, selectedFolder, searchTerm]);

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top bar with search */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              placeholder={
                selectedFolder
                  ? `Search in ${folderConfig[selectedFolder].title}...`
                  : "Search your documents..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-red-300 outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 bg-white"
            />
          </div>

          {selectedFolder && (
            <div className="hidden sm:flex items-center gap-2 ml-4">
              <ToggleButton
                icon={Grid}
                active={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
                label="Grid view"
              />
              <ToggleButton
                icon={List}
                active={viewMode === "list"}
                onClick={() => setViewMode("list")}
                label="List view"
              />
            </div>
          )}
        </div>

        {/* FOLDER VIEW */}
        {!selectedFolder && (
          <>
            {searchTerm.trim() && groupedResults ? (
              <div className="space-y-8">
                {(Object.keys(folderConfig) as AssetType[]).map((t) => {
                  const items = groupedResults[t];
                  if (!items || items.length === 0) return null;
                  const cfg = folderConfig[t];
                  return (
                    <section key={t} className="bg-white border border-gray-200 rounded-xl shadow-sm">
                      <div className="flex items-center justify-between px-5 py-4 border-b">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            {React.createElement(cfg.icon, { size: 18, className: "text-red-600" })}
                          </div>
                          <h3 className="font-semibold text-gray-900">
                            {cfg.title}{" "}
                            <span className="text-gray-500 font-normal">({items.length})</span>
                          </h3>
                        </div>
                        <button
                          onClick={() => setSelectedFolder(t)}
                          className="text-sm px-3 py-1 rounded border border-gray-200 hover:bg-gray-50"
                        >
                          View all
                        </button>
                      </div>

                      {/* quick preview list (top 6) */}
                      <ul className="divide-y">
                        {items.slice(0, 6).map((asset) => (
                          <li key={asset.id} className="flex items-center justify-between px-5 py-3">
                            <button
                              onClick={() => setPreviewAsset(asset)}
                              className="text-left truncate font-medium text-gray-900 hover:underline"
                              title={asset.name}
                            >
                              {asset.name}
                            </button>
                            <div className="text-xs text-gray-500">
                              {fileExt(asset.name) || asset.type} • {formatDateAgo(asset.uploadedAt)}
                            </div>
                          </li>
                        ))}
                      </ul>

                      {items.length > 6 && (
                        <div className="px-5 py-3 text-sm text-gray-500 border-t">
                          + {items.length - 6} more in {cfg.title}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(
                  Object.entries(folderConfig) as [AssetType, { icon: any; title: string; description: string }][]
                ).map(([type, cfg]) => (
                  <button
                    key={type}
                    onClick={() => setSelectedFolder(type)}
                    className="group relative rounded-xl overflow-hidden text-left bg-white border border-red-200 shadow-sm hover:shadow-md transition"
                  >
                    <div className="h-24 bg-gradient-to-b from-red-100 to-red-50 flex items-center justify-center relative overflow-hidden">
                      {(() => {
                        const thumbnail = getFolderThumbnail(cfg.title);
                        return thumbnail ? (
                          <img 
                            src={thumbnail.image} 
                            alt={thumbnail.alt || `${cfg.title} folder thumbnail`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to default design if image fails to load
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : (
                          <svg width="28" height="28" viewBox="0 0 24 24" className="text-red-500">
                            <path
                              fill="currentColor"
                              d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                            />
                          </svg>
                        );
                      })()}
                      <div className={`${getFolderThumbnail(cfg.title) ? 'hidden' : ''}`}>
                        <svg width="28" height="28" viewBox="0 0 24 24" className="text-red-500">
                          <path
                            fill="currentColor"
                            d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-sm mb-1 text-gray-900 group-hover:text-red-600">
                        {cfg.title}
                      </h3>
                      <p className="text-xs text-gray-600">{cfg.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-600 mt-4">
                        <span className="opacity-70">Last updated</span>
                        <span>{lastUpdatedFor(type)}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ASSET VIEW */}
        {selectedFolder && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  {React.createElement(folderConfig[selectedFolder].icon, {
                    size: 18,
                    className: "text-red-600",
                  })}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {folderConfig[selectedFolder].title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {folderConfig[selectedFolder].description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFolder(null)}
                className="px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-sm"
              >
                ← Back to folders
              </button>
            </div>

            {filteredAssets.length === 0 ? (
              <div className="text-center py-16">
                <Package size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No assets found in this folder.</p>
              </div>
            ) : viewMode === "grid" ? (
              // GRID VIEW
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition p-4"
                  >
                    <div onClick={() => setPreviewAsset(asset)} className="cursor-pointer">
                      {asset.type === "image" || asset.type === "logo" ? (
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="w-full h-44 object-cover rounded mb-3"
                        />
                      ) : (
                        <div className="w-full h-44 flex items-center justify-center bg-gray-100 rounded mb-3">
                          <Package className="text-gray-400" size={28} />
                        </div>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{asset.name}</h3>
                        <p className="text-xs text-gray-500">{formatDateAgo(asset.uploadedAt)}</p>
                      </div>
                      <button
                        onClick={() => downloadAsset(asset)}
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                        title={`Download ${asset.name}`}
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // LIST VIEW
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                  <div className="col-span-6">Name</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-2 text-right pr-1">Uploaded</div>
                </div>
                <ul className="divide-y">
                  {filteredAssets.map((asset) => (
                    <li key={asset.id} className="grid grid-cols-12 items-center px-4 py-3 hover:bg-gray-50">
                      <button
                        onClick={() => setPreviewAsset(asset)}
                        className="col-span-6 text-left truncate font-medium text-gray-900 hover:underline"
                        title={asset.name}
                      >
                        {asset.name}
                      </button>
                      <div className="col-span-2 text-gray-600 capitalize flex items-center gap-2">
                        {asset.type === "image" || asset.type === "logo" ? (
                          <span className="inline-flex items-center gap-1">
                            <Image size={16} /> {asset.type}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <Package size={16} /> {asset.type}
                          </span>
                        )}
                      </div>
                      <div className="col-span-2 text-gray-600">{formatSize(asset.size)}</div>
                      <div className="col-span-2 flex items-center justify-end gap-3">
                        <span className="text-xs text-gray-500">{formatDateAgo(asset.uploadedAt)}</span>
                        <button
                          onClick={() => downloadAsset(asset)}
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                          title={`Download ${asset.name}`}
                        >
                          <Download size={14} />
                          Download
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Preview Modal */}
        {previewAsset && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-lg max-w-3xl w-full relative">
              <button
                onClick={() => setPreviewAsset(null)}
                className="absolute top-3 right-3 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                aria-label="Close preview"
              >
                <X size={18} />
              </button>
              <div className="p-6">
                {previewAsset.type === "image" || previewAsset.type === "logo" ? (
                  <img
                    src={previewAsset.url}
                    alt={previewAsset.name}
                    className="w-full max-h-[70vh] object-contain rounded"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded">
                    <Package className="text-gray-400" size={48} />
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{previewAsset.name}</h3>
                    <p className="text-xs text-gray-500">{formatDateAgo(previewAsset.uploadedAt)}</p>
                  </div>
                  <button
                    onClick={() => downloadAsset(previewAsset)}
                    className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded border border-gray-200 hover:bg-gray-50"
                  >
                    <Download size={16} /> Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          
        )}
      </div>
       <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <Shield size={14} />
            <span>Your Secure Healthcare Innovation Platform</span>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            © 2025 Mednet Health. All rights reserved.
          </div>
        </div>
    </div>
  );
}

export default Library;
