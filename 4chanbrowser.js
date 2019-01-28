// ==UserScript==
// @name     4chan browser
// @version  1
// @grant    none
// @include boards.4channel.org/*/*
// @include boards.4chan.org/*/*
// ==/UserScript==
/*var button = document.createElement('button')
button.innerHTML = "Enable 4chan browser"
button.onclick = main
document.body.appendChild(button)
console.log("Button added")*/
main()

async function main() {
    console.log("We are in business baby")
    await sleep(2000)
    let formelem = document.getElementById("delform")
    let thread = formelem.getElementsByClassName("thread")[0]
    let posts = thread.children
    var cursor = 1
    let p = highlightPost(cursor)
    let expanded = []
    for(var i = 0; i < posts.length; ++i) {
        expanded[i] = false
    }
  let mode = 0 // 0 - normal ; 1 - insert
  keyBuffer = []
  keyBufferSize = 3
    document.addEventListener('keydown', async function(e) {
        if(e.keyCode == 75 && mode == 0) {
            //k
            if(cursor == 0) return;
            cursor--
            unhighlight(p)
            p = highlightPost(cursor)
        }
        if(e.keyCode == 74 && mode == 0) {
            //j
            if(cursor == posts.length-1) return;
            cursor++
            unhighlight(p)
            p = highlightPost(cursor)
        }

        if(e.keyCode == 76 && mode == 0) {
                //l; expand image
     
            if(!expanded[cursor]) {
            let file = p.children[2]
        let filetext = file.children[0]
        //console.log(filetext)
        let largesrc = filetext.children[0].getAttribute('href')
        //console.log(largesrc)
                let link = file.children[1]       
        //console.log("Expand dong")         
                let newim = await expandImage(largesrc)
        link.children[0].style = "display: none";
        //console.log("Old image hidden")
        //console.log(newim)
        link.insertBefore(newim,link.children[0].nextSibling)
        //console.log(link.children)
                expanded[cursor] = newim
        newim.scrollIntoView()
            }
        }
        if(e.keyCode == 72 && mode == 0) {
          //h; collapse image
                if(expanded[cursor]) {
                let file = p.children[2]
                    let link = file.children[1]
                    expanded[cursor].remove()
          expanded[cursor] = false
          link.children[0].style = "";
          link.children[0].scrollIntoView()
          centerScroll()
            }
        }
    if(e.keyCode == 83 && mode == 0) {
      console.log("s")
         //s; save image
      let file = p.children[2]
      let filetext = file.children[0]
      let largesrc = filetext.children[0].getAttribute('href')
      //let name = window.prompt("Name the image: ", largesrc)
      let dlink = document.createElement('a')
      dlink.download = largesrc.slice(0,-3)+"png"
      dlink.href = await getBase64Image(largesrc)
      dlink.innerHTML = "this is a STRING"
      document.body.appendChild(dlink)
      console.log(dlink)
      dlink.click()
      document.body.removeChild(dlink)
      delete dlink
    }
    if(e.keyCode == 73 && mode == 0) {
         //insert; reply
      mode = 1
      console.log("I said assertive!")
      let postinfodesktop = p.children.item(1)
      console.log("Not insertive!")
      console.log(postinfodesktop)
      let span = postinfodesktop.children.item(3)
      console.log(span)
      let link = span.children.item(1)
      link.click()
    }
    if(mode == 1) {
      console.log("Logging key " + e.keyCode)
      if(keyBuffer.push(e.keyCode) > keyBufferSize) {
           keyBuffer.shift()
      }
      console.log("Buffer:")
      console.log(keyBuffer)
      if(arraysEqual(keyBuffer,[59,87,81])) {
          console.log("Quit")
        breakCapcha()
      }
    }
    })
}

function centerScroll() {
 let viewportH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    window.scrollBy(0, -viewportH/2);
}

function highlightPost(position){
    let formelem = document.getElementById("delform")
    let thread = formelem.getElementsByClassName("thread")[0]
    let postBox = thread.children[position]
    //console.log(postBox.children)
    let post = postBox.children.item(1)
    //4chan posts have no style; take that losers
    post.style = 'border-style: solid; border-width: 5px; border-color: red;'

    post.scrollIntoView()
  centerScroll()

    return post
}

function unhighlight(post) {
    post.style=""
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function expandImage(largesrc) {
  console.log("Large src: " + largesrc)
  let dims = await getImageDimensions(largesrc)
  //console.log(dims)
  let newim = new Image()
  newim.setAttribute('src',largesrc)
  newim.setAttribute('alt',"Image")
  newim.setAttribute('style',"max-width: "+dims[0] + "px; max-height: " + dims[1] + "px;")
  return newim
}

async function getImageDimensions(src) {
     return new Promise((resolve, reject) => {
    let im = new Image()
      im.src = src
    im.onload = () => resolve([im.width,im.height])
  })
}

async function getBase64Image(url) {
  console.log("Preparing to create base64 image")
  return new Promise((resolve, reject) => {
    let img = new Image()
      img.src = url
    img.onload = () => {
         let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
     
      let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

      let dataURL = canvas.toDataURL("image/"+url.slice(-3));
      console.log(dataURL)
      resolve(dataURL)//.replace(/^data:image\/(png|jpg);base64,/, ""));
    }
  })
}


function arraysEqual(a, b) {
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function breakCapcha() {
     //ow my bones
  let iframe = document.getElementById('qrCaptchaContainer').children.item(0).children.item(0).children.item(0)
  console.log(iframe)
  iframe.click()
  console.log("Constructing mouse event")
  let mouseEvent = new MouseEvent('click',{
                                            bubbles: true,
                                            cancelable: true,
                                            view: window
  })
  console.log("Dispatching event")
  iframe.dispatchEvent(mouseEvent)
}




