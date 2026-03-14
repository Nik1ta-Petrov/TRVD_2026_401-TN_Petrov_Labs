import { NextResponse } from 'next/server';

const fallbackImages = [
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop", 
];

export async function GET() {
  try {
    const response = await fetch('https://np.pl.ua/wp-json/wp/v2/posts?per_page=6&_embed', { 
        cache: 'no-store',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
    });
    
    if (!response.ok) throw new Error('Не вдалося отримати дані з API');
    
    const posts = await response.json();

    const latestNews = posts.map((post: any) => {
      
      let img = "";
      if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url) {
          img = post._embedded['wp:featuredmedia'][0].source_url;
      }

      const cleanTitle = post.title.rendered
        .replace(/&#8211;/g, '–')
        .replace(/&#8212;/g, '—')
        .replace(/&#8220;|&#8221;/g, '"')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#[0-9]+;/g, ''); 

      return {
        title: cleanTitle,
        link: post.link,
        pubDate: new Date(post.date).toLocaleString('uk-UA', {
          day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
        }),
        source: 'Новини Полтавщини',
        imageUrl: img || fallbackImages[0]
      };
    });

    return NextResponse.json(latestNews);
  } catch (error: any) {
    console.error('Помилка API Новин:', error);
    return NextResponse.json({ error: 'Не вдалося завантажити новини' }, { status: 500 });
  }
}