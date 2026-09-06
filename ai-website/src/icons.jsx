import React from 'react';

const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const IcoMenu = () => (<svg {...base}><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/></svg>);
export const IcoSidebar = () => (<svg {...base}><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="9" y1="4" x2="9" y2="20"/></svg>);
export const IcoClose = () => (<svg {...base}><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>);
export const IcoSearch = () => (<svg {...base}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>);
export const IcoPlus = () => (<svg {...base}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
export const IcoChat = () => (<svg {...base}><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 8.7 8.7 0 0 1-3.9-.9L3 21l1.9-5.4a8.2 8.2 0 0 1-.9-3.9 8.4 8.4 0 0 1 8.5-8.3 8.5 8.5 0 0 1 8.5 8.3z"/></svg>);
export const IcoDots = () => (<svg {...base} strokeWidth="2.4"><circle cx="5" cy="12" r="0.6"/><circle cx="12" cy="12" r="0.6"/><circle cx="19" cy="12" r="0.6"/></svg>);
export const IcoPin = () => (<svg {...base}><path d="M12 17v5"/><path d="M9 3h6l-1 7 3 3v2H7v-2l3-3-1-7z"/></svg>);
export const IcoPencil = () => (<svg {...base}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>);
export const IcoTrash = () => (<svg {...base}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>);
export const IcoUpload = () => (<svg {...base}><rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="8.5" cy="8.5" r="1.6"/><path d="M21 15.5l-5-5-11 11"/></svg>);
export const IcoMic = () => (<svg {...base}><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/></svg>);
export const IcoSend = () => (<svg {...base} fill="currentColor" stroke="none"><path d="M3 11.5 21 12 3 12.5 7.6 16.6 6.5 18 3 11.5z" transform="rotate(0)"/><path d="M2.9 10.8 21.4 11.5a.6.6 0 0 1 0 1.2L2.9 13.6c-.4 0-.6-.5-.4-.8l1-1.4-1-1.4c-.2-.4 0-.9.4-.9z" fill-rule="evenodd"/><path d="M6.4 15.6 4.9 20.3c-.1.4.4.7.7.4l4.7-4.1-2.4-1.6z"/></svg>);
export const IcoSendPaper = () => (<svg {...base}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
export const IcoSun = () => (<svg {...base}><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>);
export const IcoMoon = () => (<svg {...base}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>);
export const IcoCopy = () => (<svg {...base}><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>);
export const IcoVolume = () => (<svg {...base}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.6 5.4a9 9 0 0 1 0 13.2"/></svg>);
export const IcoArrowDown = () => (<svg {...base}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>);
export const IcoStop = () => (<svg {...base}><rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor" stroke="none"/></svg>);
export const IcoCheck = () => (<svg {...base}><polyline points="20 6 9 17 4 12"/></svg>);
export const IcoDownload = () => (<svg {...base}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
export const IcoBroom = () => (<svg {...base}><path d="M9.5 3.5 14 8l-6 6-4.5-4.5 6-6z"/><path d="M14 8l6.5 6.5a2.1 2.1 0 0 1-3 3L11 11"/></svg>);
export const IcoSpark = () => (<svg {...base}><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3z"/><path d="M19 3l.7 2 2 .7-2 .8-.7 2-.8-2-2-.7 2-.8.8-2z"/></svg>);
export const IcoKeyboard = () => (<svg {...base}><rect x="2" y="6" width="20" height="12" rx="2.5"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M18 14h.01M9 14h6"/></svg>);
export const IcoLogout = () => (<svg {...base}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>);
export const IcoAlert = () => (<svg {...base}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13"/><path d="M12 17h.01"/></svg>);
export const IcoBolt = () => (<svg {...base}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>);
export const IcoLock = () => (<svg {...base}><rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>);
export const IcoGlobe = () => (<svg {...base}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18"/></svg>);
export const IcoFile = () => (<svg {...base}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>);
// Official GitHub mark (filled) — needs fill + its own 16x16 viewBox
const ghBase = { width: 18, height: 18, viewBox: '0 0 16 16', fill: 'currentColor', stroke: 'none', 'aria-hidden': true };
export const IcoGithub = () => (<svg {...ghBase}><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>);

// ============================================================
// Workspace icons (line style, same base)
// ============================================================
export const IcoHome = () => (<svg {...base}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>);
export const IcoTasks = () => (<svg {...base}><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7.5 9.5l2 2 3-3.5"/><path d="M7.5 15.5h9"/></svg>);
export const IcoInbox = () => (<svg {...base}><path d="M3 13h4l1.5 3h7L17 13h4"/><path d="M3 13 5.5 5h13L21 13v5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-5z"/></svg>);
export const IcoCalendar = () => (<svg {...base}><rect x="3" y="5" width="18" height="16" rx="2.5"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
export const IcoReports = () => (<svg {...base}><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></svg>);
export const IcoPaperclip = () => (<svg {...base}><path d="M21 11.5l-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8l8.5-8.5a3.7 3.7 0 0 1 5.2 5.2l-8.5 8.5a1.85 1.85 0 0 1-2.6-2.6l7.8-7.8"/></svg>);
export const IcoFolder = () => (<svg {...base}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>);
export const IcoStar = () => (<svg {...base}><polygon points="12 3 14.7 8.6 20.8 9.4 16.4 13.7 17.5 19.8 12 16.9 6.5 19.8 7.6 13.7 2.2 9.4 8.3 8.6"/></svg>);
export const IcoChevronRight = () => (<svg {...base}><polyline points="9 6 15 12 9 18"/></svg>);
export const IcoChevronDown = () => (<svg {...base}><polyline points="6 9 12 15 18 9"/></svg>);
export const IcoClock = () => (<svg {...base}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>);
