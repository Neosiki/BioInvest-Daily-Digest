import { NewsItem } from "../types";
import pptxgen from "pptxgenjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// 1. 변환된 폰트의 Base64 문자열을 상수로 정의 (매우 길기 때문에 별도 파일로 관리 추천)
// 실제 서비스 적용 시 여기에 실제 TTF 파일의 Base64 인코딩 문자열을 삽입하세요.
const KOREAN_FONT_BASE64 = "AAEAAA... (여기에 변환한 Base64 내용 삽입) ...";

export function copyToNotepad(news: NewsItem[]) {
  let text = "BioInvest Daily Digest - Top 10 News\n";
  text += "========================================\n\n";

  news.forEach((item, index) => {
    text += `[${index + 1}] ${item.titleKr}\n`;
    text += `    ${item.titleEn}\n`;
    text += `----------------------------------------\n`;
    text += `- Category: ${item.category} | Impact: ${item.weight} | Sentiment: ${item.sentimentScore}/100\n`;
    text += `- Date: ${item.date}\n\n`;
    text += `[요약]\n${item.summaryKr}\n\n`;
    text += `[Summary]\n${item.summaryEn}\n\n`;
    text += `[투자 포인트]\n`;
    item.investmentPointsKr.forEach(p => text += `* ${p}\n`);
    text += `\n[Investment Points]\n`;
    item.investmentPointsEn.forEach(p => text += `* ${p}\n`);
    
    if (item.expertQuote) {
      text += `\n[전문가 코멘트]\n"${item.expertQuote.quote}"\n- ${item.expertQuote.author} (${item.expertQuote.title})\n`;
    }

    text += `\nSource: ${item.url}\n`;
    text += `========================================\n\n`;
  });

  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard! (Notepad-Friendly format)");
  }).catch(err => {
    console.error("Failed to copy text: ", err);
    alert("Failed to copy text.");
  });
}

export async function downloadPdf() {
  const elements = document.querySelectorAll(".pdf-export-target");
  if (!elements || elements.length === 0) {
    alert("No content found to export. Please ensure news or analysis is loaded.");
    return;
  }

  try {
    const pdf = new jsPDF("p", "mm", "a4");
    
    // 3. 한글 폰트 등록 및 설정
    // 'myFont.ttf'는 가상의 이름이며, 'normal' 스타일로 등록합니다.
    // (주의: KOREAN_FONT_BASE64가 실제 유효한 데이터일 때만 등록하도록 안전장치 추가)
    try {
      if (KOREAN_FONT_BASE64.length > 100) {
        pdf.addFileToVFS('myFont.ttf', KOREAN_FONT_BASE64);
        pdf.addFont('myFont.ttf', 'myFont', 'normal');
        pdf.setFont('myFont'); // 폰트 적용
      }
    } catch (fontError) {
      console.warn("폰트 등록 실패 (유효한 Base64 문자열이 필요합니다):", fontError);
    }

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pdfWidth - margin * 2;
    
    let currentY = margin;

    // Add a title
    pdf.setFontSize(16);
    pdf.text(`BioInvest Digest - ${new Date().toISOString().slice(0, 10)}`, margin, currentY + 5);
    currentY += 15;

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i] as HTMLElement;
      
      const canvas = await html2canvas(el, { 
        scale: 2,
        useCORS: true, // 외부 이미지나 아이콘이 있을 경우 대비
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

      // Check if we need a new page
      if (currentY + imgHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.addImage(imgData, "PNG", margin, currentY, contentWidth, imgHeight);
      currentY += imgHeight + 10; // Add some spacing between elements
    }

    // 5. 파일 저장
    pdf.save(`BioInvest_Digest_${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (error) {
    console.error("PDF 생성 중 오류 발생:", error);
    alert("PDF 다운로드 중 오류가 발생했습니다.");
  }
}

export function downloadPpt(news: NewsItem[]) {
  const pptx = new pptxgen();

  pptx.author = "BioInvest Digest";
  pptx.company = "BioInvest";
  pptx.title = "Daily Digest";

  // Title Slide
  const slide = pptx.addSlide();
  slide.background = { color: "111111" };
  slide.addText("BioInvest Daily Digest", {
    x: 1, y: 2, w: "80%", h: 1,
    fontSize: 44, color: "FFFFFF", bold: true, fontFace: "Playfair Display"
  });
  slide.addText("Top 10 Global Healthcare & Biotech News", {
    x: 1, y: 3, w: "80%", h: 1,
    fontSize: 24, color: "00FF85", fontFace: "DM Sans"
  });

  // News Slides
  news.forEach((item, index) => {
    const s = pptx.addSlide();
    s.background = { color: "FFFFFF" };
    
    // Header
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.8, fill: { color: "111111" } });
    s.addText(`News #${index + 1} | ${item.category}`, {
      x: 0.5, y: 0.1, w: "90%", h: 0.6,
      fontSize: 18, color: "FFFFFF", fontFace: "DM Sans", bold: true
    });

    // Title
    s.addText(item.titleKr, {
      x: 0.5, y: 1.0, w: "90%", h: 0.8,
      fontSize: 22, color: "111111", fontFace: "Playfair Display", bold: true
    });
    s.addText(item.titleEn, {
      x: 0.5, y: 1.8, w: "90%", h: 0.5,
      fontSize: 14, color: "888888", fontFace: "DM Sans"
    });

    // Summary
    s.addText("Summary", {
      x: 0.5, y: 2.5, w: "45%", h: 0.4,
      fontSize: 14, color: "00FF85", fontFace: "DM Sans", bold: true
    });
    s.addText(item.summaryKr, {
      x: 0.5, y: 2.9, w: "45%", h: 1.5,
      fontSize: 12, color: "333333", fontFace: "DM Sans"
    });

    // Investment Points
    s.addText("Investment Points", {
      x: 5.0, y: 2.5, w: "45%", h: 0.4,
      fontSize: 14, color: "00FF85", fontFace: "DM Sans", bold: true
    });
    
    const pointsText = item.investmentPointsKr.map(p => ({ text: p, options: { bullet: true } }));
    s.addText(pointsText, {
      x: 5.0, y: 2.9, w: "45%", h: 1.5,
      fontSize: 12, color: "333333", fontFace: "DM Sans"
    });

    // Footer
    s.addText(`Impact: ${item.weight} | Sentiment: ${item.sentimentScore} | Source: ${item.url}`, {
      x: 0.5, y: 5.0, w: "90%", h: 0.4,
      fontSize: 10, color: "888888", fontFace: "JetBrains Mono"
    });
  });

  pptx.writeFile({ fileName: `BioInvest_Digest_${new Date().toISOString().split('T')[0]}.pptx` });
}
