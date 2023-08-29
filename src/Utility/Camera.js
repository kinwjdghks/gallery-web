export const getWebcam = (callback) => {
    try {
      const constraints = {
        'video': true,
        'audio': false
      }
      navigator.mediaDevices.getUserMedia(constraints)
        .then(callback);
    } catch (err) {
      console.log(err);
      return undefined;
    }
  };

export const Style1 = {
    Video: { width: "56.25%", height: "100%", background: 'rgba(245, 240, 215, 0.5)' },
    None: { display: 'none' }
  };
export const Style2 = {
    Video: { width: "100%", height: "56.25%", background: 'rgba(245, 240, 215, 0.5)' },
    None: { display: 'none' }
}
export const Style3 = {
    Video: { width: "100%", height: "100%", background: 'rgba(245, 240, 215, 0.5)' },
    None: { display: 'none' }
}
