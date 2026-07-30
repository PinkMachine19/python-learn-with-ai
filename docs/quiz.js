/**
 * Shared session quiz logic + explanation modal.
 * Every session: clicking an option pops a modal showing whether you were
 * right or wrong (green check / red X) and the explanation, inline.
 */
(function () {
  'use strict';

  var CORRECT_INTROS = [
    { title: 'Correct!', sub: 'Here is why, so it sticks.', emoji: '✅', btn: 'Next question' },
    { title: 'Nailed it', sub: 'The reasoning below is the part worth remembering.', emoji: '🎯', btn: 'Got it' },
    { title: 'Yep, that\'s it', sub: 'Read the why below — it\'s the actual lesson.', emoji: '✅', btn: 'Continue' },
  ];

  var WRONG_INTROS = [
    { title: 'Not quite', sub: 'This is the part that actually teaches you something.', emoji: '❌', btn: 'Got it' },
    { title: 'Close, but no', sub: 'Read the explanation below before moving on.', emoji: '❌', btn: 'Understood' },
    { title: 'That\'s not it', sub: 'Getting it wrong and reading why is how this sticks.', emoji: '❌', btn: 'Next question' },
  ];

  var modalBuilt = false;
  var overlay;
  var titleEl;
  var subEl;
  var emojiEl;
  var explainEl;
  var resultEl;
  var btnEl;
  var modalEl;
  var correctMsgIndex = 0;
  var wrongMsgIndex = 0;

  function buildModal() {
    if (modalBuilt) return;
    modalBuilt = true;

    overlay = document.createElement('div');
    overlay.className = 'quiz-explain-overlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'alertdialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'quiz-explain-title');

    overlay.innerHTML =
      '<div class="quiz-explain-modal" id="quiz-explain-modal">' +
      '  <div class="quiz-explain-emoji" id="quiz-explain-emoji"></div>' +
      '  <div class="quiz-explain-body">' +
      '    <h3 id="quiz-explain-title" class="quiz-explain-title"></h3>' +
      '    <div class="quiz-explain-explanation" id="quiz-explain-explanation"></div>' +
      '    <p class="quiz-explain-sub" id="quiz-explain-sub"></p>' +
      '  </div>' +
      '  <div class="quiz-explain-actions">' +
      '    <button type="button" class="quiz-explain-btn" id="quiz-explain-btn">Got it</button>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(overlay);

    modalEl = document.getElementById('quiz-explain-modal');
    titleEl = document.getElementById('quiz-explain-title');
    subEl = document.getElementById('quiz-explain-sub');
    emojiEl = document.getElementById('quiz-explain-emoji');
    explainEl = document.getElementById('quiz-explain-explanation');
    btnEl = document.getElementById('quiz-explain-btn');

    btnEl.addEventListener('click', closeExplainModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeExplainModal();
    });
    document.addEventListener('keydown', function (e) {
      if (!overlay.hidden && e.key === 'Escape') {
        e.preventDefault();
        closeExplainModal();
      }
    });
  }

  function showExplainModal(explanationText, isCorrect) {
    buildModal();

    var intro;
    if (isCorrect) {
      intro = CORRECT_INTROS[correctMsgIndex % CORRECT_INTROS.length];
      correctMsgIndex += 1;
    } else {
      intro = WRONG_INTROS[wrongMsgIndex % WRONG_INTROS.length];
      wrongMsgIndex += 1;
    }

    modalEl.classList.remove('is-correct', 'is-wrong');
    modalEl.classList.add(isCorrect ? 'is-correct' : 'is-wrong');

    emojiEl.textContent = intro.emoji;
    titleEl.textContent = intro.title;
    titleEl.classList.remove('is-correct', 'is-wrong');
    titleEl.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
    explainEl.textContent = explanationText || '';
    subEl.textContent = intro.sub;
    btnEl.textContent = intro.btn;

    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    btnEl.focus();
  }

  function closeExplainModal() {
    if (!overlay) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  function setupQuiz(prefix) {
    var container = document.getElementById(prefix + '-quiz');
    if (!container) return;

    var questions = container.querySelectorAll('.quiz-question');
    var btn = container.querySelector('.submit-btn');
    var answeredCount = 0;
    var correct = 0;

    var passPre = container.dataset.passPre || 'You may proceed to the lab.';
    var passPost = container.dataset.passPost || 'Session complete. Make your commit.';
    var failPre = container.dataset.failPre || 'Read the concept section carefully, then retake.';
    var failPost = container.dataset.failPost || 'Re-read the concept section and redo the lab before committing.';

    questions.forEach(function (q) {
      q.querySelectorAll('.quiz-option').forEach(function (opt) {
        opt.addEventListener('click', function () {
          if (q.dataset.answered) return;
          q.dataset.answered = 'true';
          answeredCount += 1;
          var answer = q.dataset.answer;
          var isCorrect = opt.dataset.val === answer;

          q.querySelectorAll('.quiz-option').forEach(function (o) {
            o.style.pointerEvents = 'none';
            if (o.dataset.val === answer) o.classList.add('correct');
          });

          if (isCorrect) correct += 1;
          else opt.classList.add('wrong');

          var explanation = q.querySelector('.explanation');
          if (explanation) explanation.style.display = 'block';

          showExplainModal(explanation ? explanation.textContent.trim() : '', isCorrect);

          if (answeredCount === questions.length) btn.disabled = false;
        });
      });
    });

    btn.addEventListener('click', function () {
      var result = document.getElementById(prefix + '-result');
      var pct = Math.round((correct / questions.length) * 100);
      result.style.display = 'block';
      btn.disabled = true;

      if (correct >= 4) {
        result.className = 'quiz-result pass';
        result.innerHTML = correct + '/5 correct (' + pct + '%) — Passed. ' +
          (prefix === 'pre' ? passPre : passPost);
      } else {
        result.className = 'quiz-result fail';
        result.innerHTML = correct + '/5 correct (' + pct + '%) — Below 80%. ' +
          (prefix === 'pre' ? failPre : failPost);
      }
    });
  }

  window.setupQuiz = setupQuiz;
})();
