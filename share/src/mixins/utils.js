
export default {

    getOffset(ele) {//获取鼠标在元素上的坐标
    	let mouse = {
    		x: 0,
    		y: 0
    	}
    	ele.addEventListener('mousemove',(e)=>{
    		let {x , y} = this.eventWrapper(e);
    		mouse.x = x;
    		mouse.y = y;
    	});
    	return mouse;
    },

    eventWrapper(ev) {//坐标系转换
    	let {pageX, pageY, target} = ev;
    	let {left, top} = target.getBoundingClientRect(); //用于获取某个元素相对于视窗的位置集合
    	return {
    		x: pageX - left,
    		y: pageY - top
    	}
    },

    toRad(angle) {//角度转弧度
    	return angle * Math.PI / 180;
    },

    toAngle(rad) {//弧度转角度
    	return rad * 180/ Math.PI
    },

    atan2(x, y) { //计算夹角
        return Math.atan2(x, y) * 180/ Math.PI;
    }
}