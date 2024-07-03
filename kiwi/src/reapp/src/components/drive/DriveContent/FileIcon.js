import React from 'react';
import SharedFolderIcon from '../../../images/svg/SharedFolderIcon';

import DefaultFileIcon from '../../../images/svg/file-icons/unknown.svg';
import exeIcon from '../../../images/svg/file-icons/exe.svg';
import pngIcon from '../../../images/svg/file-icons/png.svg';
// import aacIcon from '../../../images/svg/file-icons/aac.svg';
// import aiIcon from '../../../images/svg/file-icons/ai.svg';
// import archiveIcon from '../../../images/svg/file-icons/archive.svg';
// import arjIcon from '../../../images/svg/file-icons/arj.svg';
// import audioIcon from '../../../images/svg/file-icons/audio.svg';
// import aviIcon from '../../../images/svg/file-icons/avi.svg';
import cssIcon from '../../../images/svg/file-icons/css.svg';
// import csvIcon from '../../../images/svg/file-icons/csv.svg';
// import dbfIcon from '../../../images/svg/file-icons/dbf.svg';
import docIcon from '../../../images/svg/file-icons/doc.svg';
// import dwgIcon from '../../../images/svg/file-icons/dwg.svg';
// import flaIcon from '../../../images/svg/file-icons/fla.svg';
// import flacIcon from '../../../images/svg/file-icons/flac.svg';
 //import gifIcon from '../../../images/svg/file-icons/gif.svg';
import htmlIcon from '../../../images/svg/file-icons/html.svg';
// import isoIcon from '../../../images/svg/file-icons/iso.svg';
import jpgIcon from '../../../images/svg/file-icons/jpg.svg';
import jsIcon from '../../../images/svg/file-icons/js.svg';
import jsonIcon from '../../../images/svg/file-icons/json.svg';
// import mdfIcon from '../../../images/svg/file-icons/mdf.svg';
// import mp2Icon from '../../../images/svg/file-icons/mp2.svg';
// import mp3Icon from '../../../images/svg/file-icons/mp3.svg';
import mp4Icon from '../../../images/svg/file-icons/mp4.svg';
// import mxfIcon from '../../../images/svg/file-icons/mxf.svg';
// import nrgIcon from '../../../images/svg/file-icons/nrg.svg';
import pdfIcon from '../../../images/svg/file-icons/pdf.svg';
import pptIcon from '../../../images/svg/file-icons/ppt.svg';
// import psdIcon from '../../../images/svg/file-icons/psd.svg';
// import rarIcon from '../../../images/svg/file-icons/rar.svg';
// import rtfIcon from '../../../images/svg/file-icons/rtf.svg';
import svgIcon from '../../../images/svg/file-icons/svg.svg';
// import textIcon from '../../../images/svg/file-icons/text.svg';
// import tiffIcon from '../../../images/svg/file-icons/tiff.svg';
import txtIcon from '../../../images/svg/file-icons/txt.svg';
// import videoIcon from '../../../images/svg/file-icons/video.svg';
// import wavIcon from '../../../images/svg/file-icons/wav.svg';
// import wmaIcon from '../../../images/svg/file-icons/wma.svg';
// import xlsIcon from '../../../images/svg/file-icons/xls.svg';
// import xmlIcon from '../../../images/svg/file-icons/xml.svg';
import zipIcon from '../../../images/svg/file-icons/zip.svg';
// import sevenzIcon from '../../../images/svg/file-icons/7z.svg'; 

const iconMap = {
    // '7z': sevenzIcon,
    // 'aac': aacIcon,
    // 'ai': aiIcon,
    // 'archive': archiveIcon,
    // 'arj': arjIcon,
    // 'audio': audioIcon,
    // 'avi': aviIcon,
    'css': cssIcon,
    // 'csv': csvIcon,
    // 'dbf': dbfIcon,
    'doc': docIcon,
    // 'dwg': dwgIcon,
    'exe': exeIcon,
    // 'fla': flaIcon,
    // 'flac': flacIcon,
    //'gif': gifIcon,
    'html': htmlIcon,
    // 'iso': isoIcon,
    'jpg': jpgIcon,
    'js': jsIcon,
    'json': jsonIcon,
    // 'mdf': mdfIcon,
    // 'mp2': mp2Icon,
    // 'mp3': mp3Icon,
    'mp4': mp4Icon,
    // 'mxf': mxfIcon,
    // 'nrg': nrgIcon,
    'pdf': pdfIcon,
    'png': pngIcon,
    'ppt': pptIcon,
    // 'psd': psdIcon,
    // 'rar': rarIcon,
    // 'rtf': rtfIcon,
    'svg': svgIcon,
    // 'text': textIcon,
    // 'tiff': tiffIcon,
    'txt': txtIcon,
    // 'video': videoIcon,
    // 'wav': wavIcon,
    // 'wma': wmaIcon,
    // 'xls': xlsIcon,
    // 'xml': xmlIcon,
    'zip': zipIcon,
};

const FileIcon = ({ fileName, isFolder, viewMode }) => {
    const className = viewMode === 'grid' ? 'drive-content-grid-file-icon' : 'drive-content-file-icon';

    if (isFolder) {
        return <SharedFolderIcon className={className} />;
    }

    const extension = fileName.split('.').pop().toLowerCase();
    const IconComponent = iconMap[extension] || DefaultFileIcon;

    return <img src={IconComponent} alt={`${extension} file icon`} className={className} />;
};

export default FileIcon;
