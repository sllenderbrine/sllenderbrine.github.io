import VerticalLazyScrollingFrameSection from "./VerticalLazyScrollingFrameSection";
import { VerticalScrollingFrame } from "./VerticalScrollingFrame";


export default class VerticalLazyScrollingFrame extends VerticalScrollingFrame {
    constructor() {
        super();
    }
    addSection(size: number): VerticalLazyScrollingFrameSection {
        let section = new VerticalLazyScrollingFrameSection(size);
        
        return section;
    } 
}