import React from 'react';

import { useAppContext } from '../contexts/AppContext';

import { ID } from '../components/ID';
import { News } from '../components/News';
import { Title } from '../components/Title';
import { AboutMe } from '../components/AboutMe';
import { DownloadLinks } from '../components/DownloadLinks';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const Contact = () => {

  const { locale } = useAppContext();

  return (
    <>
      {/* <div style={{ height: '8rem' }}></div> */}
      <div
        style={{ height: 'var(--section-padding-with-header)' }}
      ></div>
      {/* <Title title={locale === 'ko' ? '연락처' : 'Contact'} /> */}
      <div
          style={{
              maxWidth: 'var(--section-width-default)',
              padding: '0 var(--section-padding-default)',
              margin: '0 auto',
              fontSize: 'var(--font-size-xl)',
              fontWeight: '500',
          }}
      >
          <p
              style={{
                  color: 'var(--color-on-text-subsubtle)',
              }}
          >   
          {locale === 'ko'
              ? <>연구 문의 및 협업 제안은 언제든지 환영합니다. 편하게 연락해 주세요.</>
              : <>For research inquiries or collaboration opportunities, feel free to reach out.</>
          }
          </p>
          <p
              style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--color-on-text-primary)',
              }}
          >   
              <div>
                  <a href="mailto:owj0421@naver.com">owj0421@naver.com</a>
              </div>
              <div className="material-symbols-outlined">arrow_outward</div>
          </p>

          <p
              style={{
                  paddingTop: '4rem',
                  color: 'var(--color-on-text-subsubtle)',
              }}
          >   
          {locale === 'ko'
              ? <>여기서 만날 수 있습니다. 새로운 사람들을 만나고 다양한 생각을 나누는 걸 언제나 환영합니다.</>
              : <>Come find me here. I'm always happy to meet new people and share ideas.</>
          }
          </p>
          <p
              style={{
                  color: 'var(--color-on-text-primary)',
              }}
          >   
          {locale === 'ko'
              ? <>서울, 대한민국</>
              : <>Seoul, South Korea</>
          }
          </p>
          <div style={{ width: "100%", height: '500px', marginTop: '1rem', borderRadius: '0.75rem', overflow: 'hidden' }}>
              <iframe
                  title="google-map-preview"
                  width="100%"
                  height="500px"
                  style={{ border: 0, borderRadius: 0}}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12652.173316085665!2d126.9779698!3d37.566535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca28e3f0df2d9%3A0xf65ba58ff13c474f!2sSeoul!5e0!3m2!1sen!2skr!4v1700000000000"
              ></iframe>
          </div>
      </div>
    </>
  );
};

export default Contact;