import React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import styled from "styled-components";

type DialogProps = React.PropsWithChildren<{
  visible: boolean
  width?: number
  height?: number
  title?: React.ReactNode
  onOk?: Function
  onCancel?: Function
  showBackdrop? :boolean
}>
const Dialog = (props: DialogProps) => {
  const [renderDiv, setRenderDiv] = useState<HTMLElement>();
  const { visible, height, width, title, onCancel, onOk, showBackdrop = true } = props;
  const uninstallDomTimerRef = useRef<number>();

  useLayoutEffect(() => {
    if (visible && renderDiv === undefined) {
      // 直到visible === true时才创建dom
      const div = document.createElement('div');
      document.body.appendChild(div);
      setRenderDiv(div);
    } else if (visible) {
      clearTimeout(uninstallDomTimerRef.current);
    } else if (renderDiv) {
      uninstallDomTimerRef.current = setTimeout(() => {
        renderDiv && document.body.removeChild(renderDiv);
        setRenderDiv(undefined);
      }, 5000); // 留时间给弹窗淡出动画
    }
  }, [visible]);

  useEffect(() => { renderDiv && document.body.removeChild(renderDiv) }, []);

  const [animationVisible, setAnimationVisible] = useState(false);
  useEffect(() => {
    if (renderDiv) { // 首次打开弹窗要等待dom创建
      setAnimationVisible(visible); // css变化用animationVisible触发
    }
  }, [visible, renderDiv]);

  if (!renderDiv) return null;

  return createPortal(<>
    <DialogLayout animationVisible={animationVisible} height={height} width={width}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <Title>{title}</Title>
        <Divider />
        <div style={{ flexGrow: 1 }}>{props.children}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 3px 3px 0' }}>
          <CancelButton onClick={() => onCancel && onCancel()}>取消</CancelButton>
          <DeleteButton onClick={() => onOk && onOk()}>删除</DeleteButton>
        </div>
      </div>
    </DialogLayout>
    {showBackdrop && <ModalBackDrop animationVisible={animationVisible} />}
  </>, renderDiv);
}

export default React.memo(Dialog);

const DialogLayout = styled.div<{ width?: number, height?: number, animationVisible: boolean }>`
  z-index: 1025;
  width: ${props => props.width || 400}px;
  height: ${props => props.height || 200}px;
  padding: 3px;
  border-radius: 10px;
  background-color: #fafafa;
  position: fixed;
  opacity: 0;
  top: 0vh;
  left: 50vw;
  transform: translate(-50%,-100%);
  transition: opacity .15s linear, top .3s ease-out;
  ${props => props.animationVisible && `top: 30vh; opacity: 1`}
`

const ModalBackDrop = styled.div<{ animationVisible: boolean }>`
    z-index: 1024;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #000000;
    transition: opacity .15s linear;
    opacity: 0;
    pointer-events: none;
    ${props => props.animationVisible && `opacity: .5; pointer-events: auto;`}
`

const CancelButton = styled.button`
  z-index: 1;
  position: relative;
  font-size: inherit;
  font-family: inherit;
  color: white;
  padding: 0.5em 1em;
  outline: none;
  border: none;
  border-radius: 7px;
  background-color: hsl(236, 32%, 26%);
  overflow: hidden;
  cursor: pointer;
  margin-right: 10px;

  &::after {
    content: '';
    z-index: -1;
    background-color: hsla(0, 0%, 100%, 0.2);
    position: absolute;
    top: -50%;
    bottom: -50%;
    width: 1.25em;
    transform: translate3d(-525%, 0, 0) rotate(35deg);
  }

  &:hover::after {
    transition: transform 0.45s ease-in-out;
    transform: translate3d(200%, 0, 0) rotate(35deg);
  }

`

const DeleteButton = styled.button`
  z-index: 1;
  position: relative;
  font-size: inherit;
  font-family: inherit;
  color: white;
  padding: 0.5em 1em;
  outline: none;
  border: none;
  border-radius: 7px;
  background-color: hsl(236, 32%, 26%);

  &:hover {
    cursor: pointer;
  }

  &::before {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border: 4px solid hsl(236, 32%, 26%);
    border-radius: 7px;
    transform-origin: center;
    transform: scale(1);
  }

  &:hover::before {
    transition: all 0.75s ease-in-out;
    transform-origin: center;
    transform: scale(1.75);
    opacity: 0;
  }
`

const Title = styled.div`
  font-weight: bold;
  padding: 5px 12px;
`

const Divider = styled.div`
  height: 2px;
  background: #eeeeee;
  margin: 5px 0;
`