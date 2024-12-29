// static/script.js
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.dataset.section + '-section';
            
            sections.forEach(section => {
                section.classList.remove('active');
            });
            navButtons.forEach(button => {
                button.classList.remove('active');
            });

            document.getElementById(sectionId).classList.add('active');
            btn.classList.add('active');
        });
    });

    // Sliders
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('length-value');
    const creativitySlider = document.getElementById('creativity');
    const creativityValue = document.getElementById('creativity-value');

    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });

    creativitySlider.addEventListener('input', () => {
        creativityValue.textContent = creativitySlider.value;
    });

    // Generate Story
    document.getElementById('generate-btn').addEventListener('click', async () => {
        const prompt = document.getElementById('prompt').value;
        const mode = document.getElementById('mode').value;
        const length = lengthSlider.value;
        const creativity = creativitySlider.value;

        if (!prompt.trim()) {
            alert('Please enter a valid prompt!');
            return;
        }

        try {
            const response = await fetch('/generate_story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    mode,
                    max_length: length,
                    temperature: creativity
                })
            });

            const data = await response.json();
            const storyOutput = document.getElementById('story-output');
            storyOutput.innerHTML = `
                <h3>${data.title}</h3>
                <p>${data.story}</p>
            `;
            document.getElementById('save-btn').style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate story');
        }
    });

    // Save Story
    document.getElementById('save-btn').addEventListener('click', async () => {
        const storyOutput = document.getElementById('story-output');
        const prompt = document.getElementById('prompt').value;
        
        try {
            const response = await fetch('/save_story', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    title: storyOutput.querySelector('h3').textContent,
                    story: storyOutput.querySelector('p').textContent
                })
            });

            const data = await response.json();
            alert(data.message);
            document.getElementById('save-btn').style.display = 'none';
            storyOutput.innerHTML = '';
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to save story');
        }
    });

    // Fetch Stories
    document.getElementById('fetch-stories').addEventListener('click', async () => {
        try {
            const response = await fetch('/get_stories');
            const data = await response.json();
            const storiesContainer = document.getElementById('saved-stories');
            
            storiesContainer.innerHTML = data.stories.map((story, index) => `
                <div class="saved-story">
                    <h3>Story ${index + 1}: ${story.title}</h3>
                    <p><strong>Prompt:</strong> ${story.prompt}</p>
                    <p>${story.story}</p>
                    <hr>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to fetch stories');
        }
    });
});