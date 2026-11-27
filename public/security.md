# How does Talkie handle voice data?

Talkie stores recordings and transcripts on the user's devices. Optional sync uses the user's Private CloudKit database. External model providers are optional and use keys supplied by the user.

Canonical page: https://usetalkie.com/security/

## Does Talkie upload audio to its own servers?

No. Talkie does not store audio, transcripts, API keys, or library content on Talkie servers.

## Can transcription stay on the device?

Yes. On-device dictation processes speech locally. Optional iCloud sync can transfer recordings and transcripts between devices.

## Who receives the audio when I transcribe a meeting on Mac?

With Cloud annotation enabled in Settings › Meetings and a key for the selected provider, Talkie sends the available microphone and meeting-app audio to ElevenLabs or Deepgram for transcription. Turn off Cloud annotation to save the recording without requesting that transcript.
