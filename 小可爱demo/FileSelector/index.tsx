import { dataTransferToFiles } from "@/urdf/dragDrop";
import { openFile } from "@/utils";
import { FC, useEffect, useRef } from "react";
interface FileSelectorProps {
    onFileSelect?:(files:FileList | null)=>void;
    onFileDrop?:(files:Record<string, File>)=>void;
    id:string;
    accept?:string;
    multiple?:boolean;
}
const FileSelector:FC<FileSelectorProps> = ({onFileSelect,onFileDrop,id,accept = "*",multiple = false})=>{
    const dropRef = useRef<HTMLDivElement|null>(null);
    useEffect(()=>{
      if(dropRef.current){
        const dragInFn = (e:DragEvent) => e.preventDefault();
        const dropFileFn = (e:DragEvent) => {
            e.preventDefault();
            //convert the files
            if (e.dataTransfer) {
                dataTransferToFiles(e.dataTransfer).then(files => {
                   if(onFileDrop) onFileDrop(files);
                });
            }
        };
        //drag to add file folder
        dropRef.current.addEventListener('dragover', dragInFn);
        dropRef.current.addEventListener('dragenter', dragInFn);
        dropRef.current.addEventListener('drop', dropFileFn);
        return ()=>{
            dropRef.current?.removeEventListener('dragover', dragInFn);
            dropRef.current?.removeEventListener('dragenter', dragInFn);
            dropRef.current?.removeEventListener('drop', dropFileFn);
        }
      }
    },[dropRef]);
    const handleOpenFile = async()=>{
        const changeEvent = await openFile({id,accept,multiple});
        const inputFiles = (changeEvent.target as HTMLInputElement).files;
        if(onFileSelect) onFileSelect(inputFiles);
    }
    return (<div onClick={handleOpenFile} ref={dropRef} className="w-[60px] h-[60px] border border-dashed flex items-center justify-center">
        <span>+</span>
    </div>)
}

export default FileSelector;