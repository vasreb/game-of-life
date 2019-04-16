"use strict";class Field{constructor(e,{size:t=40,nodeSize:i=20,alifeRule1:l=3,alifeRule2:s=2,alifeRule3:h=3}){this.alifeRule1=l,this.alifeRule2=s,this.alifeRule3=h,this.newField=[],this._size=t,this._wrap=e,this._nodeSize=i,this._field=[],this._field._size=t,this._recX1,this._recX2,this._recY1,this._recY2;for(let e=0;e<t;e++){let i=[];for(let l=0;l<t;l++){let t={x:l,y:e,h:!1};this.createNode(t),i.push(t)}this._field.push(i)}e.style.width=`${t*i}px`,e.style.height=`${t*i}px`,e.addEventListener("mousedown",e=>{e.preventDefault(),this._recX1=e.target.x,this._recY1=e.target.y}),e.addEventListener("mouseup",e=>{e.preventDefault(),this._recX2=e.target.x,this._recY2=e.target.y,this.fillRectangle()}),this._field[Symbol.iterator]=function(){let e=0,t=0,i=this;return{next:()=>(e==i._size&&(e=0,t++),t==i._size?{done:!0}:{value:i[t][e++],done:!1})}}}createNode(e){let t,i=document.createElement("div");e.html=i,i.x=e.x,i.y=e.y,t=e.h?"green":"#DDD",i.style.cssText=`\n\t\t\tbox-sizing: border-box;\n\t\t\tborder: ${.01*this._nodeSize}px solid black; \n\t\t\tbackground-color: ${t};\n\t\t\theight: ${this._nodeSize}px;\n\t\t\twidth: ${this._nodeSize}px;\n\t\t\tfont-family: Arial;\n\t\t\ttext-align: center;\n\t\t\tcolor: white;`,this._wrap.append(i)}fillRectangle(){let e=this._recX1,t=this._recX2,i=this._recY1,l=this._recY2;this._recX2<this._recX1&&(e=this._recX2,t=this._recX1),this._recY2<this._recX1&&(i=this._recY2,l=this._recY1);for(let s=i;s<=l;s++)for(let i=e;i<=t;i++)this._field[s][i].h?(this._field[s][i].h=!1,this._field[s][i].html.style.backgroundColor="#DDD"):(this._field[s][i].h=!0,this._field[s][i].html.style.backgroundColor="green")}updateMap(){for(let e=0;e<this._field._size;e++){let t=[];for(let i=0;i<this._field._size;i++){let l={};l.x=this._field[e][i].x,l.y=this._field[e][i].y,l.h=this._field[e][i].h,l.html=this._field[e][i].html,t.push(l)}this.newField._size=this._field._size,this.newField.push(t)}let e=0;for(let t of this._field){let i=this.countOfNeighbours(t,this._field);i==this.alifeRule1&&(this.newField[t.y][t.x].h=!0),i<this.alifeRule2&&(this.newField[t.y][t.x].h=!1),i>this.alifeRule3&&(this.newField[t.y][t.x].h=!1),this.newField[t.y][t.x].h?(e++,t.html.style.backgroundColor="green"):t.html.style.backgroundColor="#DDD"}for(let e=0;e<this.newField._size;e++)for(let t=0;t<this.newField._size;t++)this._field[e][t].x=this.newField[e][t].x,this._field[e][t].y=this.newField[e][t].y,this._field[e][t].h=this.newField[e][t].h,this._field[e][t].html=this.newField[e][t].html;return e}countOfNeighbours(e,t){let i=e.x,l=e.y,s=0;try{return t[l-1][i-1].h&&s++,t[l-1][i].h&&s++,t[l-1][i+1].h&&s++,t[l][i-1].h&&s++,t[l][i+1].h&&s++,t[l+1][i-1].h&&s++,t[l+1][i].h&&s++,t[l+1][i+1].h&&s++,s}catch(e){e.name}}}class Node{}const wrapper=document.querySelector(".wrapper"),button=document.querySelector(".button");button.on=!1,button.timer=0;let options={};options.size=prompt("size {cells}","40"),options.nodeSize=prompt("size of cell {px}","20"),options.alifeRule1=prompt("count of alive cells around then cell will live","3"),options.alifeRule2=prompt("min of alive neighbours for living","2"),options.alifeRule3=prompt("max of alive neighbours for living","3");let frequency=prompt("frequency {ms}","100"),university=new Field(wrapper,options);button.addEventListener("click",()=>{button.on?clearInterval(button.timer):button.timer=setInterval(()=>{button.innerHTML=university.updateMap()},frequency),button.on=!button.on});