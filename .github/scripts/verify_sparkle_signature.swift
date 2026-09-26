import CryptoKit
import Foundation

guard CommandLine.arguments.count == 4,
      let publicKeyData = Data(base64Encoded: CommandLine.arguments[1]),
      let signatureData = Data(base64Encoded: CommandLine.arguments[2]),
      let publicKey = try? Curve25519.Signing.PublicKey(rawRepresentation: publicKeyData),
      let archiveData = try? Data(contentsOf: URL(fileURLWithPath: CommandLine.arguments[3])),
      publicKey.isValidSignature(signatureData, for: archiveData) else {
    fputs("Invalid Sparkle archive signature\n", stderr)
    exit(1)
}
