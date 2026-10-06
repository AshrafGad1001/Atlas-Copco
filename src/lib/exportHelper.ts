export async function handleExport(url: string, filename: string = 'export.xlsx') {
  try {
    const tokenMatch = document.cookie.match(/token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : '';
    
    if (!token) {
      throw new Error("غير مصرح لك بالوصول");
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}${url}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      let msg = "حدث خطأ أثناء التصدير";
      if (res.status === 400) msg = "ضيّق الفلاتر أو هناك خطأ في الطلب";
      if (res.status === 401 || res.status === 403) msg = "غير مصرح لك بالوصول";
      
      try {
        const errData = await res.json();
        if (errData.message) msg = errData.message;
      } catch(e) {}
      
      throw new Error(msg);
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    
    // Attempt to parse filename from Content-Disposition if present
    const disposition = res.headers.get('Content-Disposition');
    let actualFilename = filename;
    if (disposition && disposition.includes('filename="')) {
      actualFilename = disposition.split('filename="')[1].split('"')[0];
    }

    link.download = actualFilename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error: any) {
    throw new Error(error.message || "حدث خطأ غير متوقع");
  }
}
