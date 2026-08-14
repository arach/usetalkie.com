# How does Talkie handle voice data?

Talkie stores recordings and transcripts on the user's devices. Optional sync uses the user's Private CloudKit database. External model providers are optional and use keys supplied by the user.

Canonical page: https://usetalkie.com/security/

## Does Talkie upload audio to its own servers?

No. Talkie does not store audio, transcripts, API keys, or library content on Talkie servers.

## Can transcription stay on the device?

Yes. Core transcription can run on Apple silicon without sending audio to an external transcription service.
