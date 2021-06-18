import React, { useState, useRef } from 'react';
import { Card, Image } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons'
import styles from './ChooseTemplate.less';

function CarouselTemplate (props) {

  const { Meta } = Card;
  const [files, setFiles] = useState(props.files || []);
  const [nowPosition, setNowPosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const currentIndexRef = useRef(0); // 不能用useState 会导致数据更新不及时

  const handleLeft = () => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current -= 1
      setNowPosition(currentIndexRef.current * 148)
    }
  }
  const handleRight = () => {
    if (currentIndexRef.current < files.length - 2) {
      currentIndexRef.current += 1
      setNowPosition(currentIndexRef.current * 148)
    }
  }
  const handleTemplateClick = (uid, index) => {
    setSelectedIndex(index)
    props.selectedTemplate(uid)
  }
  return (
    <div className={styles.templatePreview}>
      <LeftOutlined onClick={handleLeft} className={`${styles.arrow} ${styles.arrowLeft}`} />
      {files.map((item, index) => {
        return (
          <Card bordered={false}
            className={`${styles.oneTemplate} ${selectedIndex === index ? styles.selected : ''}`}
            key={index}
            style={{ left: `-${nowPosition}px` }}
            cover={<Image className={styles.image} preview={false} src={item.preview || 'error'} placeholder={
              <Image
                style={{ filter: 'blur(5px)' }}
                src={item.preview || 'error'}
              />
            }
              fallback={require('@/assets/common/img.png')} />}
            onClick={() => { handleTemplateClick(item.id, index) }}
          >
            <Meta title={item.name} />
          </Card>
        )
      })}
      <RightOutlined onClick={handleRight} className={`${styles.arrow} ${styles.arrowRight}`} />

    </div>
  )
}

export default CarouselTemplate;