import { useState, useRef, useEffect } from 'react'
import { useHistory } from '../hooks/useHistory'
import { useLanguage } from '../contexts/LanguageContext'
import { outputStorage } from '../utils/outputStorage'

type DocumentTool = 'txt-to-pdf' | 'md-to-pdf' | 'csv-json' | 'json-yaml' | 'json-xml'

// Helper function to convert JSON to XML
function jsonToXml(obj: any, rootName = 'root'): string {
  const jsonToXmlHelper = (val: any): string => {
    if (typeof val === 'object' && val !== null) {
      if (Array.isArray(val)) {
        return val.map(item => `<item>${jsonToXmlHelper(item)}</item>`).join('');
      }
      return Object.entries(val)
        .map(([k, v]) => {
          const cleanKey = k.replace(/^@/, '');
          return `<${cleanKey}>${jsonToXmlHelper(v)}</${cleanKey}>`;
        })
        .join('');
    }
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${jsonToXmlHelper(obj)}\n</${rootName}>`;
}

// Helper function to convert XML Node to JSON object
function xmlToObj(node: Node): any {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue?.trim() || "";
  }
  
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }
  
  const element = node as Element;
  const obj: any = {};
  
  // Attributes
  if (element.attributes.length > 0) {
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      obj[`@${attr.name}`] = attr.value;
    }
  }
  
  // Children
  let hasElementChildren = false;
  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i];
    if (child.nodeType === Node.ELEMENT_NODE) {
      hasElementChildren = true;
      const childName = child.nodeName;
      const childVal = xmlToObj(child);
      
      if (obj[childName] === undefined) {
        obj[childName] = childVal;
      } else {
        if (!Array.isArray(obj[childName])) {
          obj[childName] = [obj[childName]];
        }
        obj[childName].push(childVal);
      }
    }
  }
  
  if (!hasElementChildren) {
    const textContent = element.textContent?.trim() || "";
    if (Object.keys(obj).length === 0) {
      return textContent;
    } else {
      obj["text"] = textContent;
    }
  }
  
  return obj;
}

function DocumentTools() {
  const [activeTool, setActiveTool] = useState<DocumentTool>('txt-to-pdf')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToHistory } = useHistory()
  const { t } = useLanguage()

  // Markdown output format option
  const [mdOutputFormat, setMdOutputFormat] = useState<'pdf' | 'html'>('pdf')

  // Clear selected files when active tool changes
  useEffect(() => {
    setSelectedFiles([])
  }, [activeTool])

  const tools = [
    { id: 'txt-to-pdf' as DocumentTool, name: t('doc.toPDF'), icon: '📝' },
    { id: 'md-to-pdf' as DocumentTool, name: t('doc.mdToPdf'), icon: '📄' },
    { id: 'csv-json' as DocumentTool, name: 'CSV ↔ JSON', icon: '📊' },
    { id: 'json-yaml' as DocumentTool, name: t('doc.jsonToYaml'), icon: '⚙️' },
    { id: 'json-xml' as DocumentTool, name: t('doc.jsonToXml'), icon: '🌐' },
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      setSelectedFiles(files)
    }
  }

  const handleTxtToPdf = async () => {
    if (selectedFiles.length === 0) return

    setProcessing(true)

    try {
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')

      for (const file of selectedFiles) {
        const text = await file.text()
        const pdfDoc = await PDFDocument.create()
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Courier)

        const pageWidth = 595
        const pageHeight = 842
        const margin = 50
        const fontSize = 12
        const lineHeight = fontSize * 1.2

        let page = pdfDoc.addPage([pageWidth, pageHeight])
        let yPosition = pageHeight - margin

        const lines = text.split('\n')

        for (const line of lines) {
          if (yPosition < margin + lineHeight) {
            page = pdfDoc.addPage([pageWidth, pageHeight])
            yPosition = pageHeight - margin
          }

          page.drawText(line, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          })

          yPosition -= lineHeight
        }

        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
        const outputName = file.name.replace(/\.[^/.]+$/, '.pdf')

        // Save to output gallery
        await outputStorage.saveOutput(outputName, 'application/pdf', blob, 'document');

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = outputName
        a.click()
        URL.revokeObjectURL(url)
      }

      addToHistory(
        t('doc.history.convert'),
        'document',
        selectedFiles.length,
        `${selectedFiles.length} ${t('doc.history.convertDesc')}`
      )
    } catch (error) {
      console.error('Error convirtiendo:', error)
      alert(t('pdf.alert.error'))
    } finally {
      setProcessing(false)
    }
  }

  const handleMdToHtmlFile = async (file: File, text: string) => {
    const lines = text.split('\n');
    let htmlContent = '';
    let inList = false;
    let inCodeBlock = false;

    for (let line of lines) {
      line = line.trim();

      if (line.startsWith('```')) {
        if (inCodeBlock) {
          htmlContent += '</code></pre>\n';
          inCodeBlock = false;
        } else {
          htmlContent += '<pre class="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm font-mono my-3 border border-slate-200 dark:border-slate-800"><code class="text-slate-800 dark:text-slate-200">';
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        htmlContent += escaped + '\n';
        continue;
      }

      if (line.startsWith('# ')) {
        htmlContent += `<h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mt-6 mb-3">${line.substring(2)}</h1>\n`;
        continue;
      } else if (line.startsWith('## ')) {
        htmlContent += `<h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-5 mb-2">${line.substring(3)}</h2>\n`;
        continue;
      } else if (line.startsWith('### ')) {
        htmlContent += `<h3 class="text-xl font-semibold text-slate-900 dark:text-slate-200 mt-4 mb-2">${line.substring(4)}</h3>\n`;
        continue;
      }

      if (line.startsWith('* ') || line.startsWith('- ')) {
        if (!inList) {
          htmlContent += '<ul class="list-disc pl-6 my-3 space-y-1 text-slate-700 dark:text-slate-300">\n';
          inList = true;
        }
        let itemText = line.substring(2);
        itemText = itemText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        itemText = itemText.replace(/\*(.*?)\*/g, '<em>$1</em>');
        htmlContent += `  <li>${itemText}</li>\n`;
        continue;
      } else {
        if (inList) {
          htmlContent += '</ul>\n';
          inList = false;
        }
      }

      if (line === '') {
        continue;
      }

      let pText = line;
      pText = pText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      pText = pText.replace(/\*(.*?)\*/g, '<em>$1</em>');
      pText = pText.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sm font-mono">$1</code>');
      
      htmlContent += `<p class="my-3 text-slate-700 dark:text-slate-300 leading-relaxed">${pText}</p>\n`;
    }

    if (inList) htmlContent += '</ul>\n';
    if (inCodeBlock) htmlContent += '</code></pre>\n';

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${file.name.replace(/\.[^/.]+$/, '')}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 dark:bg-slate-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700/50">
    <div class="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
      ${htmlContent}
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const outputName = file.name.replace(/\.[^/.]+$/, '.html');

    await outputStorage.saveOutput(outputName, 'text/html', blob, 'document');

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMdToPdfFile = async (file: File, text: string) => {
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const monoFont = await pdfDoc.embedFont(StandardFonts.Courier);

    const pageWidth = 595.27;
    const pageHeight = 841.89;
    const margin = 54;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let yPosition = pageHeight - margin;

    const lines = text.split('\n');

    const addNewPage = () => {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPosition = pageHeight - margin;
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line === '') {
        yPosition -= 12;
        continue;
      }

      if (yPosition < margin + 40) {
        addNewPage();
      }

      if (line.startsWith('# ')) {
        const textStr = line.substring(2);
        yPosition -= 12;
        page.drawText(textStr, {
          x: margin,
          y: yPosition,
          size: 20,
          font: boldFont,
          color: rgb(0.1, 0.1, 0.15),
        });
        yPosition -= 24;
      } else if (line.startsWith('## ')) {
        const textStr = line.substring(3);
        yPosition -= 8;
        page.drawText(textStr, {
          x: margin,
          y: yPosition,
          size: 16,
          font: boldFont,
          color: rgb(0.15, 0.15, 0.2),
        });
        yPosition -= 20;
      } else if (line.startsWith('### ')) {
        const textStr = line.substring(4);
        yPosition -= 6;
        page.drawText(textStr, {
          x: margin,
          y: yPosition,
          size: 13,
          font: boldFont,
          color: rgb(0.2, 0.2, 0.25),
        });
        yPosition -= 18;
      } else if (line.startsWith('```')) {
        continue;
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        const textStr = line.substring(2);
        page.drawText('•', {
          x: margin,
          y: yPosition,
          size: 10,
          font: regularFont,
          color: rgb(0.2, 0.2, 0.2),
        });
        page.drawText(textStr, {
          x: margin + 15,
          y: yPosition,
          size: 10,
          font: regularFont,
          color: rgb(0.2, 0.2, 0.2),
        });
        yPosition -= 16;
      } else {
        const isMono = rawLine.startsWith('    ') || line.startsWith('`');
        const textStr = line.replace(/`/g, '');
        page.drawText(textStr, {
          x: margin,
          y: yPosition,
          size: 10,
          font: isMono ? monoFont : regularFont,
          color: isMono ? rgb(0.3, 0.1, 0.1) : rgb(0.2, 0.2, 0.2),
        });
        yPosition -= 14;
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
    const outputName = file.name.replace(/\.[^/.]+$/, '.pdf');

    await outputStorage.saveOutput(outputName, 'application/pdf', blob, 'document');

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = outputName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMdToPdf = async () => {
    if (selectedFiles.length === 0) return;
    setProcessing(true);

    try {
      for (const file of selectedFiles) {
        const text = await file.text();
        if (mdOutputFormat === 'html') {
          await handleMdToHtmlFile(file, text);
        } else {
          await handleMdToPdfFile(file, text);
        }
      }

      addToHistory(
        t('doc.history.mdToPdf'),
        'document',
        selectedFiles.length,
        `${selectedFiles.length} ${t('doc.history.convertDesc')}`
      );
    } catch (error) {
      console.error('Error converting Markdown:', error);
      alert(t('pdf.alert.error'));
    } finally {
      setProcessing(false);
    }
  };

  const handleCsvJson = async () => {
    if (selectedFiles.length === 0) return;
    setProcessing(true);

    try {
      for (const file of selectedFiles) {
        const text = await file.text();
        const isCsv = file.name.endsWith('.csv');

        if (isCsv) {
          const lines = text.split('\n').filter(line => line.trim());
          if (lines.length === 0) continue;

          const headers = lines[0].split(',').map(h => h.trim());
          const data = [];

          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const obj: any = {};

            headers.forEach((header, index) => {
              obj[header] = values[index] || '';
            });

            data.push(obj);
          }

          const jsonString = JSON.stringify(data, null, 2);
          const blob = new Blob([jsonString], { type: 'application/json' });
          const outputName = file.name.replace(/\.[^/.]+$/, '.json');

          await outputStorage.saveOutput(outputName, 'application/json', blob, 'document');

          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = outputName
          a.click()
          URL.revokeObjectURL(url)
        } else {
          const data = JSON.parse(text);

          if (!Array.isArray(data) || data.length === 0) {
            alert(t('pdf.alert.error'));
            continue;
          }

          const headers = Object.keys(data[0]);
          const csvLines = [headers.join(',')];

          data.forEach((item: any) => {
            const values = headers.map(header => {
              const value = item[header] || '';
              return typeof value === 'string' && value.includes(',')
                ? `"${value}"`
                : value;
            });
            csvLines.push(values.join(','));
          });

          const csvString = csvLines.join('\n');
          const blob = new Blob([csvString], { type: 'text/csv' });
          const outputName = file.name.replace(/\.[^/.]+$/, '.csv');

          await outputStorage.saveOutput(outputName, 'text/csv', blob, 'document');

          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = outputName
          a.click()
          URL.revokeObjectURL(url)
        }
      }

      addToHistory(
        t('doc.history.convert'),
        'document',
        selectedFiles.length,
        `${selectedFiles.length} ${t('doc.history.convertDesc')}`
      )
    } catch (error) {
      console.error('Error convirtiendo:', error)
      alert(t('pdf.alert.error'))
    } finally {
      setProcessing(false)
    }
  }

  const handleJsonYaml = async () => {
    if (selectedFiles.length === 0) return;
    setProcessing(true);

    try {
      const yaml = await import('js-yaml');

      for (const file of selectedFiles) {
        const text = await file.text();
        const isJson = file.name.endsWith('.json') || file.type === 'application/json';
        
        let outputContent = '';
        let outputName = '';
        let mimeType = '';

        if (isJson) {
          const jsonObj = JSON.parse(text);
          outputContent = yaml.dump(jsonObj);
          outputName = file.name.replace(/\.[^/.]+$/, '.yaml');
          mimeType = 'text/yaml';
        } else {
          const jsonObj = yaml.load(text);
          outputContent = JSON.stringify(jsonObj, null, 2);
          outputName = file.name.replace(/\.[^/.]+$/, '.json');
          mimeType = 'application/json';
        }

        const blob = new Blob([outputContent], { type: mimeType });
        await outputStorage.saveOutput(outputName, mimeType, blob, 'document');

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = outputName;
        a.click();
        URL.revokeObjectURL(url);
      }

      addToHistory(
        t('doc.history.jsonToYaml'),
        'document',
        selectedFiles.length,
        `${selectedFiles.length} ${t('doc.history.convertDesc')}`
      );
    } catch (error) {
      console.error('Error JSON/YAML conversion:', error);
      alert(t('pdf.alert.error'));
    } finally {
      setProcessing(false);
    }
  };

  const handleJsonXml = async () => {
    if (selectedFiles.length === 0) return;
    setProcessing(true);

    try {
      for (const file of selectedFiles) {
        const text = await file.text();
        const isJson = file.name.endsWith('.json') || file.type === 'application/json';
        
        let outputContent = '';
        let outputName = '';
        let mimeType = '';

        if (isJson) {
          const jsonObj = JSON.parse(text);
          outputContent = jsonToXml(jsonObj);
          outputName = file.name.replace(/\.[^/.]+$/, '.xml');
          mimeType = 'application/xml';
        } else {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, 'text/xml');
          
          const parserError = xmlDoc.getElementsByTagName('parsererror');
          if (parserError.length > 0) {
            throw new Error('XML parsing error');
          }

          const jsonObj = xmlToObj(xmlDoc.documentElement);
          outputContent = JSON.stringify(jsonObj, null, 2);
          outputName = file.name.replace(/\.[^/.]+$/, '.json');
          mimeType = 'application/json';
        }

        const blob = new Blob([outputContent], { type: mimeType });
        await outputStorage.saveOutput(outputName, mimeType, blob, 'document');

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = outputName;
        a.click();
        URL.revokeObjectURL(url);
      }

      addToHistory(
        t('doc.history.jsonToXml'),
        'document',
        selectedFiles.length,
        `${selectedFiles.length} ${t('doc.history.convertDesc')}`
      );
    } catch (error) {
      console.error('Error JSON/XML conversion:', error);
      alert('Error en la conversión: Verifica que el formato del archivo sea válido.');
    } finally {
      setProcessing(false);
    }
  };

  const handleProcess = () => {
    switch (activeTool) {
      case 'txt-to-pdf':
        handleTxtToPdf()
        break
      case 'md-to-pdf':
        handleMdToPdf()
        break
      case 'csv-json':
        handleCsvJson()
        break
      case 'json-yaml':
        handleJsonYaml()
        break
      case 'json-xml':
        handleJsonXml()
        break
    }
  }

  const getAcceptedFormats = () => {
    switch (activeTool) {
      case 'txt-to-pdf': return '.txt'
      case 'md-to-pdf': return '.md'
      case 'csv-json': return '.csv,.json'
      case 'json-yaml': return '.json,.yaml,.yml'
      case 'json-xml': return '.json,.xml'
      default: return '*'
    }
  }

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-200 mb-4 sm:mb-6">{t('doc.title')}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4 sm:mb-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`group relative p-3 sm:p-4 rounded-xl transition-all duration-200 ${
              activeTool === tool.id
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-gray-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-600/50'
            }`}
          >
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{tool.icon}</div>
            <div className="text-[10px] sm:text-xs font-medium leading-tight">{tool.name}</div>
            {activeTool === tool.id && (
              <div className="absolute inset-0 rounded-xl border-2 border-white/20"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tool settings panels */}
      {activeTool === 'md-to-pdf' && (
        <div className="bg-gray-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-slate-700/60 mb-4 sm:mb-6">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">
            Markdown Conversion Options
          </h3>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Output Format
            </label>
            <div className="flex gap-2 max-w-xs">
              {[
                { val: 'pdf', label: 'PDF Document' },
                { val: 'html', label: 'HTML Webpage' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setMdOutputFormat(opt.val as any)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    mdOutputFormat === opt.val
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300'
                      : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-850'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center mb-4 sm:mb-6 transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
            : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/30 hover:border-gray-400 dark:hover:border-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800/50'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptedFormats()}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors ${
            isDragging ? 'bg-indigo-500/20' : 'bg-gray-200 dark:bg-slate-700/50'
          }`}>
            <svg className={`w-6 h-6 sm:w-8 sm:h-8 ${isDragging ? 'text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className={`text-sm sm:text-base font-medium mb-1 ${isDragging ? 'text-indigo-400' : 'text-slate-900 dark:text-slate-200'}`}>
              {isDragging ? t('doc.dropzone.drag') : t('doc.dropzone.browse')}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-500">
              {activeTool === 'txt-to-pdf' && 'Accepts: .txt'}
              {activeTool === 'md-to-pdf' && 'Accepts: .md'}
              {activeTool === 'csv-json' && 'Accepts: .csv, .json'}
              {activeTool === 'json-yaml' && 'Accepts: .json, .yaml, .yml'}
              {activeTool === 'json-xml' && 'Accepts: .json, .xml'}
            </p>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2 sm:mb-3 text-xs sm:text-sm">
            {t('doc.selectedFiles')} ({selectedFiles.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="bg-gray-100 dark:bg-slate-800/50 p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 border border-gray-300 dark:border-slate-700/50 hover:border-gray-400 dark:hover:border-slate-600 transition-colors">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 dark:bg-slate-700/50 rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                  📄
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-200 truncate font-medium">{file.name}</p>
                  <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-500 mt-0.5 sm:mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleProcess}
        disabled={selectedFiles.length === 0 || processing}
        className="w-full py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm sm:text-base font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:shadow-none"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="truncate">{t('doc.processing')}</span>
          </span>
        ) : (
          <span className="truncate">{t('doc.process.button')}</span>
        )}
      </button>
    </div>
  )
}

export default DocumentTools
