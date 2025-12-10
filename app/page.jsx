import Link from 'next/link';
import { listAllPlaybillsWithConfig } from '@/lib/googleSheets.js';
import ThemeToggle from '@/app/(components)/ThemeToggle.jsx';

export const revalidate = 60;

// Helper function to extract image URL from config or formula
function extractImageUrl(value) {
  if (!value) return '';
  if (typeof value !== 'string') return '';
  
  const trimmed = value.trim();
  if (!trimmed) return '';
  
  // Handle Google Sheets IMAGE() formula
  const doubleQuoteMatch = trimmed.match(/^=IMAGE\(\s*"([^"]+)"/i);
  if (doubleQuoteMatch) {
    return doubleQuoteMatch[1];
  }
  
  const singleQuoteMatch = trimmed.match(/^=IMAGE\(\s*'([^']+)'/i);
  if (singleQuoteMatch) {
    return singleQuoteMatch[1];
  }
  
  return trimmed;
}

// Helper function to parse day and time from config
function parseDayAndTime(playbill) {
  const config = playbill.config || {};
  const day = (config.day || config.date || '').toString().trim().toUpperCase();
  const time = (config.time || '').toString().trim();
  const performingGroup = (config.performingGroup || config.group || config.school || '').toString().trim();
  const playTitle = (config.playTitle || config.title || playbill.name || '').toString().trim();
  const coverImage = extractImageUrl(config.coverImage || config.image || config.cover || '');
  
  return { day, time, performingGroup, playTitle, coverImage };
}

// Group playbills by day
function groupByDay(playbills) {
  const grouped = {};
  
  playbills.forEach(playbill => {
    const { day } = parseDayAndTime(playbill);
    if (!day) return;
    
    if (!grouped[day]) {
      grouped[day] = [];
    }
    grouped[day].push(playbill);
  });
  
  // Sort each day's playbills by time
  Object.keys(grouped).forEach(day => {
    grouped[day].sort((a, b) => {
      const timeA = parseDayAndTime(a).time;
      const timeB = parseDayAndTime(b).time;
      return timeA.localeCompare(timeB);
    });
  });
  
  return grouped;
}

export default async function HomePage() {
  let playbills = [];
  try {
    playbills = await listAllPlaybillsWithConfig();
  } catch (error) {
    console.error('Error fetching playbills:', error);
  }

  const groupedByDay = groupByDay(playbills);
  const days = Object.keys(groupedByDay).sort();
  
  // Find playbills without day configuration
  const playbillsWithoutDay = playbills.filter(playbill => {
    const { day } = parseDayAndTime(playbill);
    return !day;
  });

  return (
    <div className="landing-page">
      <div className="landing-wrapper">
        <div className="landing-header">
          <div className="landing-header-controls">
            <ThemeToggle />
          </div>
          <div className="event-logo-wrapper">
            <img 
              src="https://d15k2d11r6t6rl.cloudfront.net/pub/rkdt/op8xf5ls/tvh/vit/tle/Logo_Youth%20Festival_Horizontal_300dpi%20%281%29.png" 
              alt="Youth Festival Logo" 
              className="event-logo"
            />
          </div>
          <h1>2025 Youth Festival Playbills</h1>
          <h3>Powerful performances by young artists bringing Shakespeare to life.</h3>
          <p>Please find the playbill for your show below.</p>
        </div>
        <div className='days'>
        <div className="day">
         <h2>Friday, December 12</h2>
         <div className='shows'>
          <div className='show'>
            <a href="/the-tragedy-of-macbeth">
              <img src="https://askesis.aaronsherrill.com/api/public/dl/1SSUg8q4?inline=true" alt="Show cover" />
              <ul>
                <li>6:15 PM</li>
                <li>Teen Troupe's</li>
                <li><i>The Tragedy of Macbeth</i></li>
              </ul>
            </a>
          </div>
          <div className='show'>
            <a href="/the-comedy-of-errors">
              <img src="https://askesis.aaronsherrill.com/api/public/dl/E25v9Ixa?inline=true" alt="Show cover" />
              <ul>
                <li>8:30 PM</li>
                <li>Common Ground High School's</li>
                <li><i>The Comedy of Errors</i></li>
              </ul>
            </a>
          </div>
         </div>
        </div>
        <div className="day">
         <h2>Saturday, December 13</h2>
         <div className='shows'>
          <div className='show'>
            <a href="/hamlet">
              <img src="https://askesis.aaronsherrill.com/api/public/dl/idW_q-UB?inline=true" alt="Show cover" />
              <ul>
                <li>2:00 PM</li>
                <li>New Haven Academy's</li>
                <li><i>Hamlet</i></li>
              </ul>
            </a>
          </div>
          <div className='show'>
            <a href="/as-you-like-it">
              <img src="https://askesis.aaronsherrill.com/api/public/dl/LN3aG7IA?inline=true" alt="Show cover" />
              <ul>
                <li>6:00PM</li>
                <li>Educational Center for the Arts'</li>
                <li><i>As You Like It</i></li>
              </ul>
            </a>
          </div>
         </div>
        </div>
        </div>
        <div className="partners-section">
          <h2>THANKS TO OUR PARTNERS</h2>
          <div className="bee-row bee-row-17">
            <div className="bee-row-content">
              <div className="bee-col bee-col-1 bee-col-w3">
                <div className="bee-block bee-block-1 bee-image">
                  <img className="bee-center bee-autowidth" src="https://d15k2d11r6t6rl.cloudfront.net/pub/rkdt/op8xf5ls/goh/6ma/bri/8406ed3e-ec22-4d86-a7d5-2c6ec95a3c81.png" style={{maxWidth: '215px'}} alt="" title="" />
                </div>
                <div className="bee-block bee-block-2 bee-image">
                  <img className="bee-center bee-fixedwidth" src="https://d15k2d11r6t6rl.cloudfront.net/pub/rkdt/op8xf5ls/zwl/z70/5f3/Nora%20Roberts%20Foundation.jpg" style={{maxWidth: '157px'}} alt="" title="" />
                </div>
                <div className="bee-block bee-block-3 bee-image">
                  <img className="bee-center bee-autowidth" src="https://d15k2d11r6t6rl.cloudfront.net/pub/rkdt/op8xf5ls/hzu/1f9/426/3825154a-5d8c-42a3-87f5-e76142630fc1.png" style={{maxWidth: '200px'}} alt="" title="" />
                </div>
              </div>
              <div className="bee-col bee-col-2 bee-col-w3">
                <div className="bee-block bee-block-1 bee-image">
                  <img className="bee-center bee-autowidth" src="https://d15k2d11r6t6rl.cloudfront.net/pub/rkdt/op8xf5ls/l8g/8q6/i0s/Seedlings%20logo.png" style={{maxWidth: '205px', borderRadius: '5px'}} alt="" title="" />
                </div>
                <div className="bee-block bee-block-2 bee-image">
                  <img className="bee-center bee-autowidth" src="https://d15k2d11r6t6rl.cloudfront.net/pub/rkdt/op8xf5ls/8mq/pvp/x9s/Logo_CarolynFoundation.webp" style={{maxWidth: '225px', borderRadius: '5px'}} alt="" title="" />
                </div>
                <div className="bee-block bee-block-3 bee-heading">
                  <h1><span className="tinyMce-placeholder">The Jane and William Curran Foundation</span></h1>
                </div>
                <div className="bee-block bee-block-4 bee-image">
                  <img className="bee-center bee-fixedwidth" src="https://d15k2d11r6t6rl.cloudfront.net/pub/rkdt/op8xf5ls/lf6/efx/0vj/2025%20MFund%20stacked.png" style={{maxWidth: '169px'}} alt="" title="" />
                </div>
              </div>
              <div className="bee-col bee-col-3 bee-col-w3">
                <div className="bee-block bee-block-1 bee-image">
                  <img className="bee-center bee-autowidth" src="https://d15k2d11r6t6rl.cloudfront.net/pub/rkdt/op8xf5ls/z13/1aa/bqf/Hartford%20Healthcare%20GoHealth%20Urgent%20Care.png" style={{maxWidth: '225px'}} alt="" title="" />
                </div>
                <div className="bee-block bee-block-2 bee-image">
                  <img className="bee-center bee-fixedwidth" src="https://d15k2d11r6t6rl.cloudfront.net/pub/rkdt/op8xf5ls/t5u/omj/135/CFGNH%20block.webp" style={{maxWidth: '168px'}} alt="" title="" />
                </div>
                <div className="bee-block bee-block-3 bee-image">
                  <img className="bee-center bee-fixedwidth" src="https://d15k2d11r6t6rl.cloudfront.net/pub/rkdt/op8xf5ls/lut/dg7/1ln/NewAlliance%20Foundation%20Logo.png" style={{maxWidth: '213px'}} alt="" title="" />
                </div>
                <div className="bee-block bee-block-4 bee-image">
                  <img className="bee-center bee-autowidth" src="https://d15k2d11r6t6rl.cloudfront.net/pub/rkdt/op8xf5ls/kd3/559/2p4/Scripps.png" style={{maxWidth: '225px'}} alt="" title="" />
                </div>
              </div>
              <div className="bee-col bee-col-4 bee-col-w3">
                <div className="bee-block bee-block-1 bee-heading">
                  <h1><span className="tinyMce-placeholder">Donors to the Barbara Schaffer Education Fund</span></h1>
                </div>
                <div className="bee-block bee-block-2 bee-divider">
                  <div className="center bee-separator" style={{borderTop: '1px solid #0a9396', width: '85%'}}></div>
                </div>
                <div className="bee-block bee-block-3 bee-paragraph">
                  <p><em>with support from</em></p>
                </div>
                <div className="bee-block bee-block-4 bee-image">
                  <img className="bee-center bee-fixedwidth" src="https://d15k2d11r6t6rl.cloudfront.net/pub/rkdt/op8xf5ls/66h/ghb/cp0/NHV_ArtsCultureTourism%20-%20Copy.png" style={{maxWidth: '56px'}} alt="" title="" />
                </div>
                <div className="bee-block bee-block-5 bee-image">
                  <img className="bee-center bee-fixedwidth" src="https://d15k2d11r6t6rl.cloudfront.net/pub/rkdt/op8xf5ls/nao/dua/mhe/CT-Logo-Vert-RGB.png" style={{maxWidth: '135px'}} alt="" title="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
