document.getElementById('phone').addEventListener('input', function() {
    if (this.value.indexOf('+234') !== 0) {
      this.value = '+234';
    }
  });